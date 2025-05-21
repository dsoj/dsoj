import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';
import Api from '@/lib/ApiUtils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ tagname: string[]; }>; }) {
    const tag = (await params)?.tagname[0];

    if (!tag) {

        return Api.Response(false, 'Invalid tag name');
    }

    const client = await connectMongoClient();
    try {
        const problemList = await client
            .db("Judge")
            .collection("Problems")
            .find({ tags: tag }, { projection: { _id: 0 } })
            .toArray();

        if (!problemList) {
            return Api.NotFound('Problem not found');
        }

        return Api.Response(true, "Problems fetched", { problemList });
    } catch (err) {
        return Api.ServerError(err);
    }
}