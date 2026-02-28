/**
 * parseCSV.js — Raw CSV Parser
 *
 * Only responsible for reading a CSV file and returning raw rows + headers.
 * No column detection or normalization happens here — that's handled by
 * columnMapper.js and normalizer.js respectively.
 */

const fs = require("fs");
const csv = require("csv-parser");

/**
 * Parse a CSV file and return raw rows and detected headers.
 *
 * @param {string} filePath - Absolute path to the CSV file
 * @returns {Promise<{ headers: string[], rows: Object[] }>}
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (h) => {
        headers = h;
      })
      .on("data", (row) => {
        // Skip completely empty rows
        const values = Object.values(row);
        const hasData = values.some((v) => v && v.toString().trim() !== "");
        if (hasData) {
          rows.push(row);
        }
      })
      .on("end", () => {
        console.log(`📄 CSV parsed: ${rows.length} rows, ${headers.length} columns`);
        console.log(`   Headers: [${headers.join(", ")}]`);
        resolve({ headers, rows });
      })
      .on("error", (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      });
  });
};

module.exports = { parseCSV };
