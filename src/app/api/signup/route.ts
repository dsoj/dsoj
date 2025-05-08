import { connectMongoClient } from '@/lib/db';
import { genUniqueId } from '@/lib/RandomUtils';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { ApiResponse } from '@/lib/ApiUtils';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, email, password, nickname } = body;

    try {
        const client = await connectMongoClient();

        // Check if the request body is valid
        if (!name || !email || !password) {
            return ApiResponse('Invalid request body', false, 400);
        }

        // Check if the email and username already exist in the database
        const existedEmail = await client.db('Main').collection('Accounts')
            .findOne({ email: email })
            .then((user) => {
                if (user) {
                    return ApiResponse('Email already exists', false, 400);
                }
            });

        const existedUsername = await client.db('Main').collection('Accounts')
            .findOne({ name: name })
            .then((user) => {
                if (user) {
                    return ApiResponse('Username already exists', false, 400);
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

        return ApiResponse('User created successfully', true, 200);
    } catch (err) {
        console.error(err);
        return ApiResponse('Internal Server Error', false, 500);
    }
}