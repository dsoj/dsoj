import { connectMongoClient } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { tagname: string[]; }; }) {
    const tag = (await params)?.tagname[0];

    if (!tag) {
        return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 });
    }

    const client = await connectMongoClient();
    try {
        const problemList = await client
            .db("Judge")
            .collection("Problems")
            .find({ tags: tag }, { projection: { _id: 0 } })
            .toArray();

        if (!problemList) {
            return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
        }

        return NextResponse.json({ problemList });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}