import { connectMongoClient } from '@/lib/db';
import { genUniqueId } from '@/lib/RandomUtils';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import Api from '@/lib/ApiUtils';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, email, password, nickname } = body;

    try {
        const client = await connectMongoClient();

        // Check if the request body is valid
        if (!name || !email || !password) {
            return Api.Response(false, 'Invalid request body');
        }

        // Check if the email and username already exist in the database
        const existedEmail = await client.db('Main').collection('Accounts')
            .findOne({ email: email })
            .then((user) => {
                if (user) {
                    return Api.Response(false, 'Email already exists');
                }
            });

        const existedUsername = await client.db('Main').collection('Accounts')
            .findOne({ name: name })
            .then((user) => {
                if (user) {
                    return Api.Response(false, 'Username already exists');
                }
            });

        if (existedEmail) return existedEmail;
        if (existedUsername) return existedUsername;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to db

        await client.db('Main').collection('Accounts')
            .insertOne({
                id: genUniqueId(client.db('Main').collection('Accounts')),
                name: name,
                email: email,
                passwordHash: hashedPassword,
                nickname: nickname,
                createdAt: new Date(),
            });

        return Api.Response(true, 'User created successfully');
    } catch (err) {
        return Api.Response(false, 'Internal Server Error');
    }
}