// config/db.js
import mongoose from 'mongoose';

// Cache the connection to reuse in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch((error) => {
      console.error(`MongoDB Connection Error: ${error.message}`);
      cached.promise = null; // Reset promise on error
      // Don't exit in serverless - let it retry
      if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        process.exit(1);
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;