import mongoose from 'mongoose';
import { logger } from '../utils/looger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('MONGODB_URI is not set.');

    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and fill it in.'
    );
  }

  mongoose.connection.on('connected', () => {
    logger.service('DB', 'MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}