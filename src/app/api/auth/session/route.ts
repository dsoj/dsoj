import Api from '@/lib/ApiUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const session = req.cookies.get("session");
    if (!session) {
        return Api.Response(false);
    }
    return Api.Response(true);
}