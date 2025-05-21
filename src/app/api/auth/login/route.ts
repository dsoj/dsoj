import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import EnvVars from "@/constant/EnvVars";
import { connectMongoClient } from '@/lib/db';
import Api from '@/lib/ApiUtils';

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

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const session = jwt.sign({ user_id: user.id }, EnvVars.session.secret, {
                expiresIn: EnvVars.session.maxAge,
            });
            const res = Api.Response(true);
            res.cookies.set("session", session);
            res.cookies.set("username", username);
            return res;
        }
        return Api.Response(false, "Wrong username or password");
    } catch (err) {
        return Api.ServerError(err);
    }
}