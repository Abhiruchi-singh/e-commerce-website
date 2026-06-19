import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const useMemory = process.env.USE_MEMORY_DB === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  const connectWithUri = async (uri, label) => {
    const conn = await mongoose.connect(uri, {
      dbName: 'ecommerce-mern-stack',
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}${label ? ` (${label})` : ''}`);
  };

  try {
    if (useMemory) {
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'ecommerce-mern-stack' },
      });
      await connectWithUri(memoryServer.getUri(), 'in-memory');
      return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is missing! Set it in server/.env or Render Environment Variables.');
      process.exit(1);
    }

    await connectWithUri(uri);
  } catch (error) {
    if (!useMemory && !isProduction) {
      console.warn('Atlas connection failed — using in-memory DB for local dev.');
      console.warn('For persistent data: MongoDB Atlas → Network Access → Add IP (0.0.0.0/0)');
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'ecommerce-mern-stack' },
      });
      await connectWithUri(memoryServer.getUri(), 'in-memory fallback');
      return;
    }

    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
