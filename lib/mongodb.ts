import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

const DB_NAME = process.env.MONGODB_DB || 'hupuna-demozalo';

let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
if (!uri.includes(DB_NAME)) {
  uri = uri.replace(/\/$/, '') + '/' + DB_NAME;
}

const MONGODB_URI = uri;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    return { client: cachedClient, db: cachedDb };
  }

  console.log('🔌 Connecting to MongoDB with URI:', MONGODB_URI); 

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Mongoose connected to:', mongoose.connection.name);
  }

  return { client, db };
}