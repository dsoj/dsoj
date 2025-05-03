import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(404).end();
    }
    deleteCookie('session', { req, res });    
    deleteCookie('username', { req, res });
    return res.status(200).redirect('/login');
}