const fs = require("fs");
const pdfParse = require("pdf-parse");
const { normalizeTransaction } = require("./normalize");

/**
 * Parse a PDF bank statement.
 * Extracts text and attempts to identify transaction lines using pattern matching.
 */
const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const transactions = [];

  for (const line of lines) {
    const parsed = extractTransactionFromLine(line);
    if (parsed) {
      transactions.push(normalizeTransaction(parsed, "pdf"));
    }
  }

  return transactions;
};

/**
 * Attempt to extract a transaction from a single line of PDF text.
 * Uses regex patterns to identify date, amount, and description.
 */
const extractTransactionFromLine = (line) => {
  // Common date patterns: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YY, DD Mon YYYY
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  ];

  let dateMatch = null;
  for (const pattern of datePatterns) {
    const match = line.match(pattern);
    if (match) {
      dateMatch = match[1];
      break;
    }
  }

  if (!dateMatch) return null;

  // Extract amounts — look for numbers with optional commas and decimal points
  // Common formats: 1,234.56 or 1234.56 or 1,23,456.78 (Indian format)
  const amountPattern = /(?:Rs\.?\s*)?(\d{1,3}(?:,?\d{2,3})*(?:\.\d{1,2})?)\s*(?:Dr|Cr|CR|DR)?/gi;
  const amounts = [];
  let match;

  while ((match = amountPattern.exec(line)) !== null) {
    const val = parseFloat(match[1].replace(/,/g, ""));
    if (val > 0 && val < 10000000) {
      // Reasonable transaction range
      amounts.push({
        value: val,
        suffix: match[0].toUpperCase(),
      });
    }
  }

  if (amounts.length === 0) return null;

  // Use the last significant amount (typically the transaction amount)
  const primaryAmount = amounts[amounts.length - 1];
  let amount = primaryAmount.value;
  let type = "debit";

  if (
    primaryAmount.suffix.includes("CR") ||
    primaryAmount.suffix.includes("CREDIT")
  ) {
    type = "credit";
  }

  // Extract merchant/description: everything between date and amount
  const dateIndex = line.indexOf(dateMatch);
  const amountStr = primaryAmount.value.toString();
  const amountIndex = line.lastIndexOf(amountStr.split(".")[0]);

  let merchant = line
    .substring(dateIndex + dateMatch.length, amountIndex > dateIndex ? amountIndex : line.length)
    .trim();

  // Clean up the merchant string
  merchant = merchant
    .replace(/^[\s\-\/|:]+/, "")
    .replace(/[\s\-\/|:]+$/, "")
    .trim();

  if (!merchant || merchant.length < 2) {
    merchant = "Unknown Transaction";
  }

  return {
    date: dateMatch,
    amount,
    type,
    merchant,
  };
};

module.exports = { parsePDF };
