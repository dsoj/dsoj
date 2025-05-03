import EnvVars from '@src/constants/EnvVars';
import { Collection } from 'mongodb';

export function genUniqueId(collection: Collection) {
    return new Promise((resolve, reject) => {
        let randomId = Math.floor(Math.random() * 1000000000).toString();
        collection.findOne({ id: randomId })
            .then((data) => {
                if (!data) {
                    resolve(randomId as string);
                    return;
                }
                resolve(genUniqueId(collection));
            })
    })

}