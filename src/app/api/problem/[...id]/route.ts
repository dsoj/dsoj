import { connectMongoClient } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string[]; }; }) {
    const id = (await params)?.id[0];
    const searchParams = req.nextUrl.searchParams;
    const isSimple = searchParams.get('simple') === '1' ? true : false;

    if (!id) {
        return NextResponse.json({ error: 'Invalid problem id' }, { status: 400 });
    }

    const client = await connectMongoClient();
    try {
        if (isSimple) {
            const problemDetail = await client
                .db("Judge")
                .collection("Problems")
                .findOne({ id: id }, { projection: { _id: 0, title: 1, details: 1 } });

            if (!problemDetail) {
                return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
            }

            return NextResponse.json({
                problemDetail,
            });
        } else {
            const problemDetail = await client
                .db("Judge")
                .collection("Problems")
                .findOne({ id: id }, { projection: { _id: 0 } });

            if (!problemDetail) {
                return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
            }

            return NextResponse.json({
                problemDetail,
            });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }


}
