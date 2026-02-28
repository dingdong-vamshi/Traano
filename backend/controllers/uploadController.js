const path = require("path");
const fs = require("fs");
const { parseCSV } = require("../utils/parseCSV");
const { detectColumns } = require("../utils/columnMapper");
const { normalizeRows } = require("../utils/normalizer");
const { analyzeTransactions } = require("../services/anomalyService");
const Transaction = require("../models/Transaction");

/**
 * POST /api/upload
 *
 * Flow:
 * 1) Receive file via Multer
 * 2) Validate file type
 * 3) Parse CSV → raw rows + headers
 * 4) Detect columns dynamically (columnMapper)
 * 5) Normalize all rows into unified schema (normalizer)
 * 6) Run anomaly detection engine (anomalyService)
 * 7) Insert into MongoDB with anomalyScore & riskLevel
 * 8) Return processed count + risk distribution
 */
const uploadStatement = async (req, res) => {
  try {
    // --- Validate file ---
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please upload a CSV file.",
      });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== ".csv") {
      cleanupFile(filePath);
      return res.status(400).json({
        success: false,
        error: "Only CSV files are supported.",
      });
    }

    // --- Step 1: Parse CSV ---
    const { headers, rows } = await parseCSV(filePath);

    if (rows.length === 0) {
      cleanupFile(filePath);
      return res.status(400).json({
        success: false,
        error: "CSV file is empty or contains no valid data rows.",
      });
    }

    // --- Step 2: Detect columns ---
    let columnResult;
    try {
      columnResult = detectColumns(headers);
    } catch (detectionError) {
      cleanupFile(filePath);
      // detectColumns throws a structured error object
      return res.status(400).json(detectionError);
    }

    const { mapping, hasDebitCredit } = columnResult;

    // --- Step 3: Normalize rows ---
    const uploadBatchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let transactions = normalizeRows(rows, mapping, hasDebitCredit);

    if (transactions.length === 0) {
      cleanupFile(filePath);
      return res.status(400).json({
        success: false,
        error:
          "No valid transactions could be extracted. Rows may have invalid dates or zero amounts.",
        totalRowsParsed: rows.length,
      });
    }

    // --- Attach batch ID ---
    transactions = transactions.map((t) => ({
      ...t,
      uploadBatchId,
    }));

    // --- Step 4: Run anomaly detection ---
    const analyzedTransactions = analyzeTransactions(transactions);

    // --- Step 5: Store in MongoDB ---
    const savedTransactions = await Transaction.insertMany(analyzedTransactions);

    // --- Cleanup ---
    cleanupFile(filePath);

    // --- Calculate risk distribution ---
    const riskDistribution = { Normal: 0, Medium: 0, High: 0 };
    for (const tx of savedTransactions) {
      riskDistribution[tx.riskLevel] = (riskDistribution[tx.riskLevel] || 0) + 1;
    }

    console.log(
      `✅ Upload complete: ${savedTransactions.length} transactions stored (batch: ${uploadBatchId})`
    );

    // --- Response ---
    res.status(200).json({
      success: true,
      totalProcessed: savedTransactions.length,
      uploadBatchId,
      columnsDetected: mapping,
      riskDistribution,
      summary: {
        totalRowsParsed: rows.length,
        totalNormalized: transactions.length,
        totalStored: savedTransactions.length,
        skippedRows: rows.length - transactions.length,
      },
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);

    // Cleanup on error
    if (req.file?.path) cleanupFile(req.file.path);

    res.status(500).json({
      success: false,
      error: "An error occurred while processing the file.",
      message: error.message,
    });
  }
};

/**
 * GET /api/transactions
 *
 * Paginated transaction list with optional filtering.
 */
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = "date",
      order = "desc",
      type,
      batchId,
      riskLevel,
    } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (batchId) filter.uploadBatchId = batchId;
    if (riskLevel) filter.riskLevel = riskLevel;

    const sortOrder = order === "asc" ? 1 : -1;

    const transactions = await Transaction.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions.",
      message: error.message,
    });
  }
};

/**
 * GET /api/transactions/summary
 *
 * Aggregated dashboard stats.
 */
const getTransactionSummary = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();

    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);

    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(5);

    const topCategories = await Transaction.aggregate([
      { $match: { type: "debit" } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: { $abs: "$amount" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        summary,
        recentTransactions,
        topCategories,
      },
    });
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate summary.",
      message: error.message,
    });
  }
};

/**
 * Safely delete a file if it exists.
 */
const cleanupFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.warn("⚠️  File cleanup failed:", e.message);
  }
};

module.exports = { uploadStatement, getTransactions, getTransactionSummary };
