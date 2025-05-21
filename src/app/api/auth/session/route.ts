import Api from '@/lib/ApiUtils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const username = req.cookies.get("username");
    const session = req.cookies.get("session");
    if (!session || !username) {
        return Api.Response(false);
    }
    return Api.Response(true);
}