import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const session = req.cookies.get("session");
    if (!session) {
        return NextResponse.json({ session: false });
    }
    return NextResponse.json({ session: true });
}