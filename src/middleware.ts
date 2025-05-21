import { NextRequest, NextResponse } from 'next/server';
import Logger from './lib/Logger';

export function middleware(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const ua = req.headers.get('user-agent') ?? 'unknown';
    const path = req.nextUrl.pathname;

    Logger(`${req.method} ${path} | ${ip} | ${ua}`, "INFO", "SERVER");
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'], // avoid static sources
};