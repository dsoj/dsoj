import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';
import Api from '@/lib/ApiUtils';

export async function GET(req: NextRequest, { params }: { params: { id: string[]; }; }) {
    const id = (await params)?.id[0];

    if (!id) {
        return Api.Response(false, 'Invalid problem id');
    }

    const client = await connectMongoClient();
    try {
        const problemDetail = await client
            .db("Judge")
            .collection("Problems")
            .findOne({ id: id }, { projection: { _id: 0 } });
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
            return Api.NotFound('Problem not found');
        }

        return Api.Response(true, "Problem fetched", {
            problemDetail,
            result: {
                // ac: ac_result,
                // wa: wa_result,
            }
        });
    } catch (err) {
        return Api.ServerError(err);
    }


}
