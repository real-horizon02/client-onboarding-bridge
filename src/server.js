/**
 * src/server.js
 * Express application factory — registers all route handlers.
 */

import express from 'express';
import { logger } from './utils/logger.js';
import { telegramRouter } from './connectors/telegram.js';
import { slackRouter } from './connectors/slack.js';

export function createServer() {
  const app = express();

  // Parse raw body for signature verification BEFORE json middleware
  app.use((req, _res, next) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  });

  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'client-onboarding-bridge', ts: new Date().toISOString() });
  });

  // Telegram webhook endpoint
  app.use('/telegram', telegramRouter);

  // Slack Events API endpoint
  app.use('/slack', slackRouter);

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  // Error handler
  app.use((err, _req, res, _next) => {
    logger.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'internal_server_error' });
  });

  return app;
}

