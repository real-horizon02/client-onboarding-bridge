/**
 * src/connectors/telegram.js
 * Inbound webhook handler and outbound client message delivery adapter.
 */

import express from 'express';
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { generateCaseId } from '../utils/case-id.js';

export const telegramRouter = express.Router();

/**
 * Inbound webhook endpoint from Telegram
 */
telegramRouter.post('/webhook', async (req, res) => {
  const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
  if (secretHeader !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    logger.warn('Unauthorized Telegram webhook attempt');
    return res.status(403).json({ error: 'unauthorized' });
  }

  const { message } = req.body;
  if (!message || !message.text) {
    logger.info('Ignoring non-text or service message from Telegram');
    return res.status(200).json({ ok: true, ignored: true });
  }

  const chatId = String(message.chat.id);
  const intakeChatId = String(process.env.TELEGRAM_INTAKE_CHAT_ID);

  if (chatId !== intakeChatId) {
    logger.info({ chatId, intakeChatId }, 'Message received from non-intake chat');
    return res.status(200).json({ ok: true, ignored: true });
  }

  const caseId = generateCaseId();
  logger.info({ caseId, from: message.from?.username || message.from?.id }, 'New intake received');

  try {
    // Forward event to Switch Local Server to trigger Intake Agent
    await axios.post(
      `http://${process.env.SWITCH_SERVER_HOST}:${process.env.SWITCH_SERVER_PORT}/events`,
      {
        type: 'telegram_intake_received',
        caseId,
        from: message.from,
        text: message.text,
        chatId,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'X-API-Key': process.env.SWITCH_SERVER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ ok: true, caseId });
  } catch (err) {
    logger.error({ err: err.message, caseId }, 'Failed to route telegram event to Switch Server');
    res.status(500).json({ error: 'switch_dispatch_failed' });
  }
});

/**
 * Outbound deliverer - send approved package to prospect Telegram chat
 */
export async function sendTelegramDelivery(chatId, text) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId || process.env.TELEGRAM_DELIVERY_CHAT_ID;

  logger.info({ targetChatId }, 'Dispatching approved package to Telegram');

  const response = await axios.post(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      chat_id: targetChatId,
      text,
      parse_mode: 'Markdown'
    }
  );

  return response.data;
}
