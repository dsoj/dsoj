import { connectMongoClient } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = await connectMongoClient();
    const problems = await client
        .db("Judge")
        .collection("Problems")
        .find({}, { projection: { _id: 0, details: 0 } })
        .toArray()
        .catch((err) => {
            console.error(err);
            return [];
        });
    return NextResponse.json(problems);
}