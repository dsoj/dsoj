import { IReq, IRes } from "@src/routes/types/types";
import { ILoginRes, Iuser } from '@src/models/User';
import { NextFunction } from "express";
import { WithId, Document } from "mongodb";
import bcrypt, { hash } from 'bcrypt';

// TODO
// function authMiddleware(req: IReq, res:IRes, next: NextFunction){
//     if(req.session)
// }

// check if the account is banned
// if banned, return `details<ILoginRes>`
export function checkBanned(data: WithId<Document>) {
    // TODO error code handle
    if (false) {
        return { access: false, status: 'LD-2', Details: '' } as ILoginRes;
    }
    return false;
}


const saltRounds = 10;

// generate password hash
// Return a Promise
export function genHash(password: string) {
    const hashHandler = new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash: string) => {
            if (err) {
                reject(err);
                return;
            };
            resolve(hash);
        })
    })
    return hashHandler;
}

// compare password hash
// return a Promise
export function compareHash(password: string, hash: string) {
    const hashHandler = new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                reject(err);
                return;
            };
            resolve(result);
        })
        resolve(password);
    })
    return hashHandler;
}
