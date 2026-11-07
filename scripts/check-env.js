/**
 * scripts/check-env.js
 * Validates .env configuration against required keys without leaking values.
 */

import 'dotenv/config';

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
  'APPROVAL_TIMEOUT_HOURS'
];

console.log('🔍 Checking environment configuration...\n');

let missingCount = 0;
for (const key of REQUIRED) {
  const val = process.env[key];
  if (!val || val === 'REPLACE_ME') {
    console.log(`❌  ${key}: Missing or default REPLACE_ME value`);
    missingCount++;
  } else {
    console.log(`✅  ${key}: Configured`);
  }
}

if (missingCount > 0) {
  console.log(`\n⚠️  ${missingCount} variable(s) require attention before running services.`);
  process.exit(1);
} else {
  console.log('\n✨ All required environment variables are set!');
  process.exit(0);
}
