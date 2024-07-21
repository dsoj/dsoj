import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import client from "@/lib/db";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import EnvVars from "@/constants/EnvVars";
import { NextApiRequest, NextApiResponse } from "next";

export default async function LoginApiHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(404);

    const loginForm: ILoginForm = req.body;
    const { name, password } = loginForm;

    if (!name || !password) {
        return res.status(200).json({ message: "Invalid request", session: false });
    }

    const user = await client.db('Main').collection('Accounts')
        .findOne({ name: name }, { projection: { _id: 0 } });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const session = jwt.sign({ user_id: user.id }, EnvVars.session.secret, {
            expiresIn: EnvVars.session.maxAge,
        });
        setCookie("session", session, {req, res, maxAge: parseInt(EnvVars.session.maxAge)})
        return res.status(200).json({ message: "Login successful", session: session });
    }
    return res.status(200).json({ message: "Login failed", session: false });

}
