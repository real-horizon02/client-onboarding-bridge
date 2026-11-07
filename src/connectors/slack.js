/**
 * src/connectors/slack.js
 * Inbound Slack Events API & interactive reactions handler.
 */

import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { sendTelegramDelivery } from './telegram.js';

export const slackRouter = express.Router();

/**
 * Verifies Slack signing signature
 */
function verifySlackSignature(req) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];

  if (!signature || !timestamp) return false;

  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  if (timestamp < fiveMinutesAgo) return false;

  const sigBase = `v0:${timestamp}:${req.rawBody}`;
  const hmac = crypto
    .createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(sigBase)
    .digest('hex');

  const calculatedSignature = `v0=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(calculatedSignature, 'utf8'));
}

/**
 * Inbound Slack events route
 */
slackRouter.post('/events', async (req, res) => {
  // Handle Slack URL verification handshake challenge
  if (req.body && req.body.type === 'url_verification') {
    return res.status(200).json({ challenge: req.body.challenge });
  }

  // Signature verification
  if (process.env.NODE_ENV !== 'test' && !verifySlackSignature(req)) {
    logger.warn('Invalid Slack signature received');
    return res.status(401).json({ error: 'invalid_signature' });
  }

  const { event } = req.body;
  if (!event) {
    return res.status(200).json({ ok: true });
  }

  // Prevent bot feedback loops
  if (event.bot_id || event.subtype === 'bot_message') {
    return res.status(200).json({ ok: true, ignored: true });
  }

  // Handle PM approval via reaction added in Slack #bridge-approvals
  if (event.type === 'reaction_added') {
    const isApprover = event.user === process.env.PM_SLACK_USER_ID;
    const isApproveReaction = event.reaction === 'white_check_mark' || event.reaction === 'heavy_check_mark';
    const isRejectReaction = event.reaction === 'x';

    if (!isApprover) {
      logger.info({ user: event.user }, 'Reaction from non-PM ignored');
      return res.status(200).json({ ok: true, ignored: true });
    }

    if (isApproveReaction) {
      logger.info({ item: event.item }, 'PM approved package! Triggering Telegram delivery');
      try {
        await sendTelegramDelivery(
          process.env.TELEGRAM_DELIVERY_CHAT_ID,
          '🎉 *Your Onboarding Package is Ready!*\n\nOur team has reviewed and approved your proposal and prototype walkthrough.'
        );
      } catch (err) {
        logger.error({ err: err.message }, 'Failed to deliver approved package via Telegram');
      }
    } else if (isRejectReaction) {
      logger.info({ item: event.item }, 'PM rejected package. Looping back for revision');
    }

    return res.status(200).json({ ok: true, handled: true });
  }

  // Route other stage messages via Switch Local Server
  try {
    await axios.post(
      `http://${process.env.SWITCH_SERVER_HOST}:${process.env.SWITCH_SERVER_PORT}/events`,
      {
        type: 'slack_event_received',
        event,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'X-API-Key': process.env.SWITCH_SERVER_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to relay Slack event to Switch Local Server');
  }

  res.status(200).json({ ok: true });
});
