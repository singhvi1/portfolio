import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/useLogger.js';

export function createApp() {
  const app = express();

  const allowedOrigins = (
    process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  )
    .split(',')
    .map((o) => o.trim());

  app.use(helmet());

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  // Application HTTP request logger
  // if (process.env.NODE_ENV !== 'test') {
  // }
  app.use(requestLogger);

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}