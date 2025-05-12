import { ApiResponse, ApiServerError } from '@/lib/ApiUtils';
import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    try {
        const problem_id = searchParams.get('problem_id');
        const username = searchParams.get('username');

        const client = await connectMongoClient();

        if (!problem_id || !username) {
            return ApiResponse('Missing problem_id or username', false);
        }
        
        const result = await client.db('Judge').collection('Submissions').find({
            problem_id: problem_id,
            username: username,
        }).toArray();


        return ApiResponse('', true, result);
    } catch (error) {
        console.error('Error fetching submission:', error);
        return ApiServerError();
    }
}