import envVars from '@/constant/EnvVars';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // console.log(new URL('/login', envVars.host_url));
    const res = NextResponse.redirect(new URL('/', envVars.host_url));
    res.cookies.delete("session");
    res.cookies.delete("username");
    return res;
}