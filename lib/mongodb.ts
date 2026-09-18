import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Add MONGODB_URI to your .env.local file');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "job-tracker";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// In dev, Next.js hot-reloads modules, which would otherwise open a new
// connection on every file save. Caching the client on the global object
// keeps a single connection alive across reloads.
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;
