import Api from '@/lib/ApiUtils';
import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    try {
        const problem_id = searchParams.get('problem_id');
        const username = searchParams.get('username');

        const client = await connectMongoClient();

        if (!problem_id || !username) {
            return Api.Response(false, 'Missing problem_id or username');
        }

        const result = await client.db('Judge').collection('Submissions').find({
            problem_id: problem_id,
            username: username,
        }).toArray();


        return Api.Response(true, '', result);
    } catch (error) {
        return Api.ServerError(error);
    }
}