export function getMongoURI(user: string, password: string, host: string){
    return `mongodb+srv://${user}:${password}@${host}`;
}

