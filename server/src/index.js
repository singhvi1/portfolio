import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { validateEnv } from './config/validateEnv.js';

async function start() {
  validateEnv();

  try {
    await connectDB();
  } catch (err) {
    console.error('[startup] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  const app = createApp();
  const port = process.env.PORT || 5000;

  const server = app.listen(port, () => {
    console.log(`[server] Listening on http://localhost:${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('[server] Closed HTTP server and MongoDB connection.');
      process.exit(0);
    });
    // Force-exit if shutdown hangs
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
  });
}

start();
