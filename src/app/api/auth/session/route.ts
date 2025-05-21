import Api from '@/lib/ApiUtils';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_KEY ?? '';

export async function GET(req: NextRequest) {
    const username = req.cookies.get("username")?.value;
    const token = req.cookies.get("session_token")?.value;
    if (!token || !username || !secret) {
        return Api.Response(false);
    }
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        // Session is valid
        return Api.Response(true, undefined, { payload });
    } catch (e) {
        // Session is invalid
        return Api.Response(false);
    }
}