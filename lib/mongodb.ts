import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

async function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
  }

  return globalForMongo.mongoClientPromise;
}

export async function getApplicationsCollection() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db(process.env.MONGODB_DB_NAME || "job_tracker");
  return db.collection("applications");
}
