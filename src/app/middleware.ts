import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { method, url, headers } = req;
    console.log(`[HTTP] ${method} ${url} - User-Agent: ${headers.get('user-agent')}`);
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};