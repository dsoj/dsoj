import EnvVars from "@/constant/EnvVars";
import { MongoClient } from "mongodb";


let cacheClient: MongoClient | null = null;

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
    await client.connect();
  } catch (e) {
    console.error(e);
    throw e;
  }
  cacheClient = client;
  return cacheClient;
}

export function getMongoURI(user: string, password: string, host: string) {
  return `mongodb+srv://${user}:${password}@${host}`;
}