import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const ua = request.headers.get('user-agent') ?? 'unknown';
    const path = request.nextUrl.pathname;

    console.log(`[LOG] ${request.method} ${path} | IP: ${ip} | ${new Date().toISOString()} | UA: ${ua} \n`);

    return NextResponse.next();
}
