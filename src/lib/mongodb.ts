// src/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 20, // Increased from 10 to handle more concurrent connections
  minPoolSize: 5,
  maxIdleTimeMS: 120000, // Increased from 60s to 2 minutes
  connectTimeoutMS: 15000, // Increased from 10s to 15s
  socketTimeoutMS: 60000, // Increased from 45s to 60s
  serverSelectionTimeoutMS: 20000, // Increased from 15s to 20s
  retryWrites: true,
  retryReads: true,
  waitQueueTimeoutMS: 10000, // Set timeout for waiting in the connection queue
};

// Global type for MongoDB client
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Track connection status
let isConnecting = false;
let connectionError: Error | null = null;
let lastConnectionAttempt = 0;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve connection across hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    isConnecting = true;
    global._mongoClientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected successfully');
        isConnecting = false;
        connectionError = null;
        return client;
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        isConnecting = false;
        connectionError = error;
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection with pooling
  client = new MongoClient(uri, options);
  isConnecting = true;
  clientPromise = client.connect()
    .then(client => {
      console.log('MongoDB connected successfully');
      isConnecting = false;
      connectionError = null;
      return client;
    })
    .catch(error => {
      console.error('Error connecting to MongoDB:', error);
      isConnecting = false;
      connectionError = error;
      throw error;
    });
}

// Cache the database connection
let cachedDb: ReturnType<MongoClient['db']> | null = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return { db: cachedDb, client };
  }

  try {
    // Check if we're currently trying to connect
    if (isConnecting) {
      console.log('Connection already in progress, waiting...');
    }
    
    // If the last attempt failed, don't retry too quickly
    const now = Date.now();
    if (connectionError && now - lastConnectionAttempt < 5000) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay
    }
    
    lastConnectionAttempt = now;
    const connectedClient = await clientPromise;
    const db = connectedClient.db(process.env.MONGODB_DB);
    cachedDb = db;
    
    // Test the connection with a simple ping
    await db.command({ ping: 1 });
    
    return { db, client: connectedClient };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Reset the cached client so we can try again next time
    cachedDb = null;
    global._mongoClientPromise = undefined;
    connectionError = error as Error;
    
    // Add a slight delay before rejecting to prevent rapid retries
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw error;
  }
}