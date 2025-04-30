import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import envVars from '@/constants/EnvVars';

export async function GET(req: Request) {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete("session");
    res.cookies.delete("username");
    return res;
}