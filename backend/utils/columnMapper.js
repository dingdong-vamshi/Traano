/**
 * columnMapper.js — Dataset-Agnostic Column Detection Engine
 *
 * Dynamically detects important columns from ANY CSV file by matching
 * header names against keyword patterns. Works for:
 * - Bank statement exports
 * - UPI transaction dumps
 * - Credit card exports
 * - Payment app exports
 * - Any structured transaction CSV
 *
 * NEVER hardcodes column names. All detection is pattern-based.
 */

// Keyword patterns for each target field
// Order matters — earlier keywords are higher priority
const FIELD_PATTERNS = {
  date: [
    "date",
    "transaction_date",
    "txn_date",
    "trans_date",
    "trans date",
    "transaction date",
    "value_date",
    "value date",
    "posting_date",
    "posting date",
    "timestamp",
    "time",
    "datetime",
    "created_at",
    "created at",
    "txn date",
  ],

  amount: [
    "amount",
    "transaction_amount",
    "transaction amount",
    "txn_amount",
    "txn amount",
    "value",
    "total",
    "sum",
    "price",
    "amt",
  ],

  debit: [
    "debit",
    "debit_amount",
    "debit amount",
    "withdrawal",
    "withdrawal_amount",
    "withdrawal amt",
    "dr",
    "money_out",
    "money out",
    "spent",
    "expense",
  ],

  credit: [
    "credit",
    "credit_amount",
    "credit amount",
    "deposit",
    "deposit_amount",
    "deposit amt",
    "cr",
    "money_in",
    "money in",
    "received",
    "income",
  ],

  description: [
    "description",
    "narration",
    "remarks",
    "details",
    "transaction_details",
    "transaction details",
    "particulars",
    "note",
    "notes",
    "memo",
    "payee",
    "merchant",
    "merchant_name",
    "merchant name",
    "beneficiary",
    "receiver",
    "sender",
    "upi_id",
    "upi id",
    "to",
    "from",
  ],

  category: [
    "category",
    "merchant_category",
    "merchant category",
    "type",
    "transaction_type",
    "transaction type",
    "txn_type",
    "txn type",
    "payment_type",
    "payment type",
    "mode",
    "channel",
    "label",
    "tag",
  ],

  transactionId: [
    "transaction_id",
    "transaction id",
    "txn_id",
    "txn id",
    "reference",
    "reference_id",
    "reference id",
    "ref_no",
    "ref no",
    "reference_number",
    "reference number",
    "utr",
    "rrn",
    "order_id",
    "order id",
    "id",
  ],
};

// Fields that MUST be present for valid processing
const REQUIRED_FIELDS = ["date"];
// At least one of these must be found
const AMOUNT_FIELDS = ["amount", "debit", "credit"];

/**
 * Detect and map CSV headers to internal field names.
 *
 * @param {string[]} headers - Raw CSV header names
 * @returns {{ mapping: Object, hasDebitCredit: boolean, unmapped: string[] }}
 * @throws {Object} Structured error if required columns are missing
 */
const detectColumns = (headers) => {
  // Normalize headers to lowercase and trim
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

  const mapping = {};
  const usedHeaders = new Set();

  // For each target field, find the best matching header
  for (const [field, keywords] of Object.entries(FIELD_PATTERNS)) {
    const match = findBestMatch(normalizedHeaders, keywords, usedHeaders);
    if (match !== null) {
      // Store mapping as: internalField → originalHeaderName
      mapping[field] = headers[match.index];
      usedHeaders.add(match.index);
    }
  }

  // --- Validate required fields ---
  const missing = [];

  // Check date column
  if (!mapping.date) {
    missing.push("date");
  }

  // Check amount — need either a single amount column OR debit+credit
  const hasAmount = !!mapping.amount;
  const hasDebit = !!mapping.debit;
  const hasCredit = !!mapping.credit;
  const hasDebitCredit = hasDebit || hasCredit;

  if (!hasAmount && !hasDebitCredit) {
    missing.push("amount (or debit/credit)");
  }

  if (missing.length > 0) {
    const error = {
      success: false,
      error: "Required columns not found",
      missing,
      detectedHeaders: headers,
      suggestion:
        "Ensure your CSV contains columns for: date and amount (or debit/credit). " +
        "Column names are matched using keyword detection.",
    };
    throw error;
  }

  // Identify unmapped headers (stored in metadata)
  const unmapped = headers.filter((_, i) => !usedHeaders.has(i));

  console.log("📊 Column Detection Results:");
  console.log("   Mapped:", JSON.stringify(mapping, null, 2));
  console.log("   Unmapped:", unmapped);
  console.log("   Debit/Credit mode:", hasDebitCredit);

  return {
    mapping,
    hasDebitCredit,
    unmapped,
  };
};

/**
 * Find the best matching header for a set of keywords.
 * Uses a scoring system:
 * - Exact match = highest score
 * - Starts with keyword = medium score
 * - Contains keyword = lower score
 *
 * @param {string[]} headers - Normalized header names
 * @param {string[]} keywords - Keywords to match against
 * @param {Set} usedHeaders - Already mapped header indices (to avoid double mapping)
 * @returns {{ index: number, score: number } | null}
 */
const findBestMatch = (headers, keywords, usedHeaders) => {
  let bestMatch = null;
  let bestScore = 0;

  for (let i = 0; i < headers.length; i++) {
    if (usedHeaders.has(i)) continue;

    const header = headers[i];

    for (let k = 0; k < keywords.length; k++) {
      const keyword = keywords[k];
      let score = 0;

      if (header === keyword) {
        // Exact match — highest priority
        score = 1000 - k; // earlier keywords score higher
      } else if (header.startsWith(keyword + "_") || header.startsWith(keyword + " ")) {
        score = 500 - k;
      } else if (keyword.length >= 4 && header.includes(keyword)) {
        // Only use .includes() for keywords with 4+ chars
        // Short keywords like "cr", "dr", "to", "id" cause false positives
        score = 200 - k;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { index: i, score };
      }
    }
  }

  return bestMatch;
};

module.exports = { detectColumns, FIELD_PATTERNS };
