import { IProblemListItem } from '@/interface/IProblem';
import { connectMongoClient } from '@/lib/db';
import { ApiResponse, ApiServerError } from '@/utils/ApiUtils';


export async function GET() {
    // TODO: set filter 
    try {
        const client = await connectMongoClient();
        let favourites = (await client
            .db("Judge")
            .collection("Problems")
            .find({}, { projection: { _id: 0, details: 0 } })
            .toArray()
            .catch((err) => {
                console.error(err);
                return [];
            })) as IProblemListItem[];

        return ApiResponse('OK', true, {
            favourites: favourites,
            recent: favourites,
            my_submissions: favourites,
            top_hits: favourites,
        });
    } catch (err) {
        console.error(err);
        return ApiServerError();
    }
}