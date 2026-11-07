/**
 * src/utils/case-id.js
 * Generates unique, non-PII case identifiers.
 * Format: COB-YYYYMMDD-XXXX  (COB = Client Onboarding Bridge)
 */

import { randomUUID } from 'crypto';

/**
 * @returns {string} e.g. "COB-20261108-A3F9"
 */
export function generateCaseId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = randomUUID().split('-')[0].toUpperCase().slice(0, 4);
  return `COB-${date}-${suffix}`;
}

