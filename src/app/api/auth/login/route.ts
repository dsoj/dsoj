import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';
import { connectMongoClient } from '@/lib/db';
import Api from '@/lib/ApiUtils';
import Logger from '@/lib/Logger';

// JWT secret
import EnvVars from '@/constant/EnvVars';
import { NextRequest } from 'next/server';
import { UserStatus } from '@/constant/User';
const secret = EnvVars.session.secret ?? '';

export async function POST(req: NextRequest) {
    try {
        const body: ILoginForm = await req.json();
        const username = body.username;
        const password = body.password;

        // validate credentials
        if (!username || !password) {
            return Api.Response(false, "Invalid request");
        }

        // db fetching
        const client = await connectMongoClient();
        const user = await client.db('Main').collection('Accounts')
            .findOne({ username: username }, { projection: { _id: 0 } });

        // compare password
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            // check if user is banned
            if (user.status === UserStatus.BANNED) {
                return Api.Response(false, "User is banned");
            } 

            // create JWT token
            const token = await new SignJWT({ userId: user.id, username: user.name, role: user.role })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('1h')
                .sign(new TextEncoder().encode(secret));

            // update last login time
            await client.db('Main').collection('Accounts')
                .updateOne({ username: username }, { $set: { lastLogin: new Date() } });
                
            // log the login event
            Logger(`User ${username} logged in`, "INFO", "AUTH");

            // set cookies
            const res = Api.Response(true);
            res.cookies.set("session_token", token);
            res.cookies.set("username", username);
            return res;
        }
        return Api.Response(false, "Wrong username or password");
    } catch (err) {
        return Api.ServerError(err);
    }
}