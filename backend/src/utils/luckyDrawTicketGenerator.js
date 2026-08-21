const crypto = require('crypto');

/**
 * Generates a unique, formatted ticket number for Lucky Draw entries.
 * Format: LD-YYYY-XXXXXX (e.g., LD-2026-000123 or random 6-digit suffix)
 * @param {number} sequenceNumber Optional sequence counter
 * @returns {string} Unique ticket number
 */
const generateTicketNumber = (sequenceNumber) => {
  const year = new Date().getFullYear();
  if (typeof sequenceNumber === 'number' && sequenceNumber > 0) {
    const paddedSeq = String(sequenceNumber).padStart(6, '0');
    return `LD-${year}-${paddedSeq}`;
  }
  const randomBuffer = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `LD-${year}-${randomBuffer}`;
};

/**
 * Generates a unique order number for Lucky Draw purchases.
 * Format: LDO-YYYYMMDD-XXXX (e.g. LDO-20260821-98A1)
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `LDO-${dateStr}-${randomSuffix}`;
};

module.exports = {
  generateTicketNumber,
  generateOrderNumber,
};
