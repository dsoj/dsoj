import { connectMongoClient } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string[]; }; }) {
    const id = (await params)?.id[0];
    const client = await connectMongoClient();

    if (!id) {
        return NextResponse.json({ error: 'Invalid problem id' }, { status: 400 });
    }

    try {
        const problemDetail = await client
            .db("Judge")
            .collection("Problems")
            .findOne({ id: id }, { projection: { _id: 0 } })
            .catch((err) => {
                console.error(err);
                return [];
            });
        // TODO: fix result fetching
        // const ac_result = (await connectMongoClient())
        //     .db("Judge")
        //     .collection("Submissions")
        //     .find({ problem_id: id, username: req.cookies.username, status: { $not: { $eq: "Failed" } } }, { projection: { _id: 0 } })
        //     .toArray()

        // const wa_result = (await mongo
        //     .db("Judge")
        //     .collection("Submissions")
        //     .find({ problem_id: id, username: context.req.cookies.username, status: "Failed" }, { projection: { _id: 0 } })
        //     .toArray()
        // );

        if (!problemDetail) {
            return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
        }

        return NextResponse.json({
            problemDetail,
            result: {
                // ac: ac_result,
                // wa: wa_result,
            }
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }


}
