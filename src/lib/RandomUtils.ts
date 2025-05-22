import { Collection } from 'mongodb';

export async function genUniqueId(collection: Collection) {
    let randomId = Math.floor(Math.random() * 1000000000).toString();
    const data = await collection.findOne({ id: randomId });
    if (!data) {
        console.log('Unique ID generated:', randomId);
        return randomId as string;
    }
    return genUniqueId(collection);
}