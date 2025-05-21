import { NextRequest, NextResponse } from 'next/server';
import Logger from './lib/Logger';

export function middleware(request: NextRequest) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const ua = request.headers.get('user-agent') ?? 'unknown';
    const path = request.nextUrl.pathname;

    Logger(`${request.method} ${path} | ${ip} | ${ua}`, "INFO", "SERVER");
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'], // avoid static sources
};