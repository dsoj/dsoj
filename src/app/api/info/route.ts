import { IProblemListItem } from '@/interface/IProblem';
import Api from '@/lib/ApiUtils';
import { connectMongoClient, dbError } from '@/lib/db';
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
    const session = req.cookies.get('session');
    if (session) {
        try {
            const client = await connectMongoClient();
            let favourites = (await client
                .db("Judge")
                .collection("Problems")
                .find({}, { projection: { _id: 0, details: 0 } })
                .toArray()
                .catch((err) => {
                    dbError(err);
                    return [];
                })) as IProblemListItem[];

            return Api.Response(true, "Info fetched", {
                favourites: favourites,
                recent: favourites,
                my_submissions: favourites,
                top_hits: favourites,
            });
        } catch (err) {
            return Api.ServerError(err);
        }
    } else {
        try {
            const client = await connectMongoClient();
            let favourites = (await client
                .db("Judge")
                .collection("Problems")
                .find({}, { projection: { _id: 0, details: 0 } })
                .toArray()
                .catch((err) => {
                    dbError(err);
                    return [];
                })) as IProblemListItem[];

            return Api.Response(true, "Info fetched", {
                top_hits: favourites,
            });
        } catch (err) {
            return Api.ServerError(err);
        }
    }
}