import { connectMongoClient } from '@/lib/db';
import { NextRequest } from 'next/server';
import Api from '@/lib/ApiUtils';

export async function GET(req: NextRequest, { params }: { params: { id: string[] } }) {
    const id = params.id[0];
    const searchParams = req.nextUrl.searchParams;
    const isSimple = searchParams.get('simple') === '1' ? true : false;

    if (!id) {
        return Api.Response(false, 'Invalid problem id');
    }

    const client = await connectMongoClient();
    try {
        let projection = {};
        if (isSimple) {
            projection = { _id: 0, title: 1, details: 1 };
        } else {
            projection = { _id: 0 };
        }

        const problemDetail = await client
            .db("Judge")
            .collection("Problems")
            .findOne({ id: id }, { projection });

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
