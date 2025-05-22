import EnvVars from '@/constant/EnvVars';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl');
    const res = NextResponse.redirect(new URL(
        (callbackUrl) ?
            `/login?callbackUrl=${callbackUrl}` :
            `/login`,
        EnvVars.host_url));
    res.cookies.delete("session");
    res.cookies.delete("username");
    return res;
}