import EnvVars from "@/constants/EnvVars";
import { MongoClient, ServerApiVersion } from "mongodb";

 
const uri = EnvVars.DB.URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};
 
let client
 
if (EnvVars.NodeEnv === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
 
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
  }
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}
 
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default client as any