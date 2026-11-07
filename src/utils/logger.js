/**
 * src/utils/logger.js
 * Structured JSON logger via pino. Never log raw tokens or secrets.
 */

import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  redact: {
    // Automatically redact any field that looks like a credential
    paths: [
      'token', 'secret', 'password', 'api_key', 'apiKey',
      'authorization', 'x-api-key', 'bearer',
      'TELEGRAM_BOT_TOKEN', 'SLACK_BOT_TOKEN',
    ],
    censor: '[REDACTED]',
  },
});

