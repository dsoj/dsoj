import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';
import EnvVars from "@/constant/EnvVars";
import { connectMongoClient } from '@/lib/db';
import Api from '@/lib/ApiUtils';
import envVars from '@/constant/EnvVars';
import Logger from '@/lib/Logger';

export async function POST(req: Request) {
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
            .findOne({ name: username }, { projection: { _id: 0 } });

        const secret = envVars.session.secret ?? '';

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const token = await new SignJWT({ userId: user.id })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('1h')
                .sign(new TextEncoder().encode(secret));
            Logger(`User ${username} logged in`, "INFO", "AUTH");
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