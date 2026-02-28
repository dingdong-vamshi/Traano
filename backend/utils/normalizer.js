/**
 * normalizer.js — Dataset-Agnostic Row Normalizer
 *
 * Converts raw CSV rows into a unified internal transaction format
 * using the column mapping from columnMapper.js.
 *
 * Unified format:
 * {
 *   date:         Date,
 *   amount:       Number,
 *   type:         String,      // "debit" | "credit" | "unknown"
 *   category:     String,
 *   description:  String,
 *   metadata:     Object,      // full original row
 *   anomalyScore: Number,      // default 0
 *   riskLevel:    String,      // default "Normal"
 * }
 */

/**
 * Normalize an array of raw CSV rows using the detected column mapping.
 *
 * @param {Object[]} rows       - Raw parsed CSV rows
 * @param {Object}   mapping    - Column mapping from detectColumns()
 * @param {boolean}  hasDebitCredit - Whether separate debit/credit columns exist
 * @returns {Object[]} Normalized transaction objects
 */
const normalizeRows = (rows, mapping, hasDebitCredit) => {
  const normalized = [];

  for (const row of rows) {
    try {
      const transaction = normalizeRow(row, mapping, hasDebitCredit);
      if (transaction) {
        normalized.push(transaction);
      }
    } catch (err) {
      // Skip malformed rows silently — log in development
      if (process.env.NODE_ENV !== "production") {
        console.warn("⚠️  Skipping malformed row:", err.message);
      }
    }
  }

  return normalized;
};

/**
 * Normalize a single CSV row into the unified transaction format.
 *
 * @param {Object}  row            - Single raw CSV row
 * @param {Object}  mapping        - Column mapping
 * @param {boolean} hasDebitCredit  - Separate debit/credit columns
 * @returns {Object|null} Normalized transaction or null if invalid
 */
const normalizeRow = (row, mapping, hasDebitCredit) => {
  // --- Extract and validate date ---
  const rawDate = getField(row, mapping.date);
  const date = parseDate(rawDate);
  if (!date) return null; // skip rows without valid date

  // --- Extract and validate amount ---
  let amount = 0;
  let type = "unknown";

  if (hasDebitCredit) {
    // Separate debit/credit columns
    const debitRaw = getField(row, mapping.debit);
    const creditRaw = getField(row, mapping.credit);

    const debitVal = parseAmount(debitRaw);
    const creditVal = parseAmount(creditRaw);

    if (debitVal > 0) {
      amount = -Math.abs(debitVal); // Debit = negative
      type = "debit";
    } else if (creditVal > 0) {
      amount = Math.abs(creditVal); // Credit = positive
      type = "credit";
    } else if (mapping.amount) {
      // Fallback to amount column if debit/credit are both empty
      const amtVal = parseAmount(getField(row, mapping.amount));
      amount = amtVal;
      type = amtVal < 0 ? "debit" : "credit";
    }
  } else {
    // Single amount column
    const rawAmount = getField(row, mapping.amount);
    amount = parseAmount(rawAmount);
    type = amount < 0 ? "debit" : "credit";
  }

  // Skip zero-amount rows
  if (amount === 0) return null;

  // --- Extract optional fields ---
  const description = cleanString(getField(row, mapping.description)) || "";
  const category = cleanString(getField(row, mapping.category)) || "Uncategorized";

  // --- Build metadata (full original row) ---
  const metadata = { ...row };

  return {
    date,
    amount: roundAmount(amount),
    type,
    category,
    description,
    metadata,
    anomalyScore: 0,
    riskLevel: "Normal",
  };
};

// ========== HELPER FUNCTIONS ==========

/**
 * Safely extract a field value from a row.
 * @param {Object} row - CSV row object
 * @param {string} columnName - Original column name from mapping
 * @returns {string}
 */
const getField = (row, columnName) => {
  if (!columnName) return "";
  return row[columnName]?.toString()?.trim() || "";
};

/**
 * Parse a date string into a valid JavaScript Date.
 * Handles multiple formats:
 * - YYYY-MM-DD (ISO)
 * - DD/MM/YYYY, DD-MM-YYYY
 * - DD/MM/YY, DD-MM-YY
 * - MM/DD/YYYY (American)
 * - "15 Jan 2024", "January 15, 2024"
 * - Unix timestamps
 *
 * @param {string} str - Raw date string
 * @returns {Date|null}
 */
const parseDate = (str) => {
  if (!str) return null;

  const cleaned = str.trim();

  // Unix timestamp (seconds or milliseconds)
  if (/^\d{10,13}$/.test(cleaned)) {
    const ts = cleaned.length === 10 ? parseInt(cleaned) * 1000 : parseInt(cleaned);
    const d = new Date(ts);
    if (isValidDate(d)) return d;
  }

  // ISO format: YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(cleaned)) {
    const d = new Date(cleaned);
    if (isValidDate(d)) return d;
  }

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (dmyMatch) {
    let [, day, month, year] = dmyMatch;
    if (year.length === 2) {
      year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
    }
    const d = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    if (isValidDate(d)) return d;
  }

  // Textual months: "15 Jan 2024", "Jan 15, 2024", "January 15 2024"
  const d = new Date(cleaned);
  if (isValidDate(d)) return d;

  return null;
};

/**
 * Check if a Date object is valid and within a reasonable range.
 */
const isValidDate = (d) => {
  if (!(d instanceof Date) || isNaN(d.getTime())) return false;
  const year = d.getFullYear();
  return year >= 1990 && year <= 2100;
};

/**
 * Parse an amount string into a number.
 * Handles: commas, currency symbols, Indian numbering, negatives, brackets.
 *
 * @param {string} str - Raw amount string
 * @returns {number}
 */
const parseAmount = (str) => {
  if (!str) return 0;

  let cleaned = str
    .toString()
    .trim()
    // Remove currency symbols
    .replace(/[₹$€£¥]/g, "")
    // Remove spaces
    .replace(/\s/g, "")
    // Remove "Rs", "INR", "USD", etc.
    .replace(/^(Rs\.?|INR|USD|EUR|GBP)/i, "")
    .trim();

  // Handle parentheses as negative: (1234.56) → -1234.56
  const isParenNegative = /^\([\d,.]+\)$/.test(cleaned);
  if (isParenNegative) {
    cleaned = cleaned.replace(/[()]/g, "");
  }

  // Remove commas
  cleaned = cleaned.replace(/,/g, "");

  // Handle Dr/Cr suffixes
  let isDebit = false;
  if (/\s*(Dr|DR)\.?$/i.test(cleaned)) {
    isDebit = true;
    cleaned = cleaned.replace(/\s*(Dr|DR)\.?$/i, "");
  } else if (/\s*(Cr|CR)\.?$/i.test(cleaned)) {
    cleaned = cleaned.replace(/\s*(Cr|CR)\.?$/i, "");
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;

  let result = isParenNegative ? -Math.abs(num) : num;
  if (isDebit) result = -Math.abs(result);

  return result;
};

/**
 * Round amount to 2 decimal places.
 */
const roundAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

/**
 * Clean and trim a string value.
 */
const cleanString = (str) => {
  if (!str) return "";
  return str.toString().trim().replace(/\s+/g, " ");
};

module.exports = { normalizeRows, normalizeRow, parseDate, parseAmount };
