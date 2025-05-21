import { connectMongoClient, dbError } from '@/lib/db';
import Api from '@/lib/ApiUtils';

export async function GET() {
    const client = await connectMongoClient();
    const problems = await client
        .db("Judge")
        .collection("Problems")
        .find({}, { projection: { _id: 0, details: 0 } })
        .toArray()
        .catch((err) => {
            dbError(err);
            return [];
        });
    return Api.Response(true, "Problems fetched", problems);
}