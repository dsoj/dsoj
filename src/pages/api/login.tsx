import { ILoginForm } from "@/interface/IUser";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";
import client from "@/lib/db";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(404);

    const loginForm: ILoginForm = req.body;
    const { name, password } = loginForm;

    if (!name || !password) {
        return res.status(400).json({ message: "Invalid request" });
    }

    const user = await client.db('Main').collection('Accounts')
        .findOne({ name: name }, { projection: { _id: 0 } });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const session = await getSession(req, res)
        session.data = { user_id: user.id };
        return res.status(200).send({ message: "Login successful" });
    }
    return res.status(401).send({ message: "Login failed" });
    
}
