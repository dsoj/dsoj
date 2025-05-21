import Api from '@/lib/ApiUtils';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_KEY ?? '';

export async function GET(req: NextRequest) {
    const username = req.cookies.get("username")?.value;
    const session = req.cookies.get("session")?.value;
    if (!session || !username || !secret) {
        return Api.Response(false);
    }
    try {
        const decoded = jwt.verify(session, secret);
        // Session is valid
        return Api.Response(true);
    } catch (e) {
        // Session is invalid
        return Api.Response(false);
    }
}