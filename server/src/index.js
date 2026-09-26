import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { validateEnv } from './config/validateEnv.js';
import { logger } from './utils/looger.js';

async function start() {
  validateEnv();

  try {
    await connectDB();
  } catch (err) {
    logger.error(`Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }

  const app = createApp();
  const port = process.env.PORT || 5000;

  const server = app.listen(port, () => {
    logger.service(
      'SERVER',
      `Listening on http://localhost:${port}`
    );
  });

  const shutdown = async (signal) => {
    logger.service(
      'SERVER',
      `${signal} received, shutting down gracefully...`
    );

    server.close(async () => {
      await mongoose.connection.close();

      logger.service(
        'SERVER',
        'Closed HTTP server and MongoDB connection.'
      );

      process.exit(0);
    });

    // Force-exit if shutdown hangs
    setTimeout(() => {
      logger.error(
        'Graceful shutdown timed out. Force exiting process.'
      );

      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error(
      `Unhandled promise rejection: ${
        reason instanceof Error ? reason.message : String(reason)
      }`
    );
  });
}

start();