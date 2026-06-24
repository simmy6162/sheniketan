import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'sheniketan';

// In development, use a global variable so the MongoClient is not
// re-created on every hot module reload.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

/**
 * Returns the She Niketan database instance.
 * Re-uses the connection in development via the global singleton.
 */
export async function connectToDatabase(): Promise<Db> {
  const mongoClient = await clientPromise;
  return mongoClient.db(MONGODB_DB);
}

export default clientPromise;
