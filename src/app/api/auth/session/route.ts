import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const username = req.cookies.get("username");
    const session = req.cookies.get("session");
    if (!session || !username) {
        return NextResponse.json({ session: false });
    }
    return NextResponse.json({ session: true });
}