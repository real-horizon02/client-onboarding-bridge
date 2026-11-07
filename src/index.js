/**
 * src/index.js
 * Entry point — loads environment, starts the Express server.
 */

import 'dotenv/config';
import { validateEnv } from './utils/env-validator.js';
import { createServer } from './server.js';
import { logger } from './utils/logger.js';

// Fail fast if required env vars are missing
validateEnv();

const PORT = process.env.PORT || 4000;
const app = createServer();

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Client Onboarding Bridge started');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received — shutting down gracefully');
  process.exit(0);
});

