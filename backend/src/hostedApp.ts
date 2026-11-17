import express from 'express';
import { createApp } from './app';
import { initializeDatabase } from './config/initializeDatabase';

export function createHostedApp(initialize = initializeDatabase) {
  const app = express();
  let ready = false;
  let pending: Promise<void> | undefined;
  app.use(async (_req, res, next) => {
    try {
      if (!ready) {
        if (!pending) pending = initialize().then(() => { ready = true; }).catch(error => {
          pending = undefined;
          throw error;
        });
        await pending;
      }
      next();
    } catch (error: any) {
      console.error('Database initialization failed:', { name: error.name, code: error.original?.code || error.code, message: error.message });
      res.status(503).json({ error: 'Database is not available. Please try again shortly.' });
    }
  });
  app.use(createApp(() => ready));
  return app;
}
