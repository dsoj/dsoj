import { getCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(404).end();
    }
    const session = getCookie("session", { req });
    if (!session) {
        return res.status(200).send(0);
    }
    res.status(200).send(1);
}