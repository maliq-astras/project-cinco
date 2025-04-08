// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000, // 1 minute
  connectTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 10000, // 10 seconds
};

// Global type for MongoDB client
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve connection across hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection with pooling
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Cache the database connection
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb, client };
  }

  const connectedClient = await clientPromise;
  const db = connectedClient.db(process.env.MONGODB_DB);
  cachedDb = db;
  
  return { db, client: connectedClient };
}