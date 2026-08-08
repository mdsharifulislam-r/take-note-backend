import mongoose from 'mongoose';
import { env } from './env';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = global as typeof global & { mongooseCache?: MongooseCache };

const cache: MongooseCache = globalCache.mongooseCache ?? { conn: null, promise: null };
globalCache.mongooseCache = cache;

const connectionOptions = {
  serverSelectionTimeoutMS: 15000,
  bufferCommands: false,
  ...(process.env.VERCEL ? {} : { family: 4 }),
};

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const isSrv = env.mongodbUri.startsWith('mongodb+srv://');
    console.log(`Connecting to MongoDB (${isSrv ? 'SRV' : 'standard'} URI)...`);

    cache.promise = mongoose.connect(env.mongodbUri, connectionOptions);
  }

  try {
    cache.conn = await cache.promise;
    console.log('MongoDB connected successfully');
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    console.error('MongoDB connection error:', error);

    if (!process.env.VERCEL) {
      process.exit(1);
    }

    throw error;
  }
};
