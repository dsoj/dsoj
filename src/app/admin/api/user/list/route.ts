import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';
import Api from '@/lib/ApiUtils';

export async function GET(req: NextRequest) {
    const client = await connectMongoClient();
    const userList = await client.db('Main').collection('Accounts').find({}, { projection: { _id: 0, passwordHash: 0 } }).toArray();

    return Api.Response(true, undefined, userList);
}