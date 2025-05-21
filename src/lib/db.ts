import EnvVars from "@/constant/EnvVars";
import { MongoClient } from "mongodb";
import Logger from './Logger';


let cacheClient: MongoClient | null = null;

export function dbError(err: any) {
  Logger(err, "ERR", "DB");
}

export async function connectMongoClient() {
  const uri = EnvVars.DB.URI;
  if (cacheClient) {
    return cacheClient;
  }

  const client = new MongoClient(uri);
  client.addListener("close", () => {
    cacheClient = null;
  });

  try {
    Logger("Connecting", "INFO", "DB");
    await client.connect();
  } catch (e) {
    dbError(e);
  }
  cacheClient = client;
  return cacheClient;
}

export function getMongoURI(user: string, password: string, host: string) {
  return `mongodb+srv://${user}:${password}@${host}`;
}