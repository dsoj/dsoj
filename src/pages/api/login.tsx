import { ILoginForm, IUser } from "@/interface/IUser";
import {MongoClient, WithId} from "mongodb";
import bcrypt from "bcryptjs";
import EnvVars from "@/constants/EnvVars";

export default async function handler(req: any, res: any) {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);
    
    if (req.method !== "POST") return res.status(404);
        console.log(req.body)
        const loginForm: ILoginForm = req.body;
        const { name, password } = loginForm;

        if (!name || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        
        const user = await mongo.db('Main').collection('Accounts')
                            .findOne({ name: name }, {projection: {_id: 0}});


        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Login failed" });
        }
}
