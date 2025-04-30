import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import EnvVars from "@/constants/EnvVars";
import { connectMongoClient } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body: ILoginForm = await req.json();

        const username = body.username;
        const password = body.password;

        // validate credentials
        if (!username || !password) {
            return NextResponse.json({ message: "Invalid request", success: false });
        }

        // db fetching
        const client = await connectMongoClient();
        const user = await client.db('Main').collection('Accounts')
            .findOne({ name: username }, { projection: { _id: 0 } });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const session = jwt.sign({ user_id: user.id }, EnvVars.session.secret, {
                expiresIn: EnvVars.session.maxAge,
            });
            const res = NextResponse.json({ success: true });;
            res.cookies.set("session", session);
            res.cookies.set("username", username);
            return res;
        }
        return NextResponse.json({ message: "Wrong username or password", success: false });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server Error", success: false });
    }
}