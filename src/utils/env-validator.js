/**
 * src/utils/env-validator.js
 * Validates required environment variables at startup.
 * Fails fast with a clear error — no silent misconfigurations.
 */

const REQUIRED = [
  'SWITCH_SERVER_HOST',
  'SWITCH_SERVER_PORT',
  'SWITCH_SERVER_API_KEY',
  'OPENCODE_API_ENDPOINT',
  'OPENCODE_API_KEY',
  'PHOTON_HOST',
  'PHOTON_PORT',
  'PHOTON_AUTH_TOKEN',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_INTAKE_CHAT_ID',
  'TELEGRAM_DELIVERY_CHAT_ID',
  'TELEGRAM_WEBHOOK_SECRET',
  'SLACK_BOT_TOKEN',
  'SLACK_SIGNING_SECRET',
  'SLACK_INTAKE_CHANNEL',
  'SLACK_SPEC_CHANNEL',
  'SLACK_QUOTE_CHANNEL',
  'SLACK_DEMO_CHANNEL',
  'SLACK_APPROVALS_CHANNEL',
  'PM_SLACK_USER_ID',
  'APPROVAL_TIMEOUT_HOURS',
];

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key] || process.env[key] === 'REPLACE_ME');

  if (missing.length > 0) {
    console.error('❌  Missing or unset environment variables:');
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error('\nCopy .env.example → .env and fill in all REPLACE_ME values.');
    process.exit(1);
  }
}

