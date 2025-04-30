import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete("session");
    res.cookies.delete("username");
    return res;
}