/**
 * anomalyService.js — Statistical Anomaly Detection Engine
 *
 * Orchestrates the full anomaly detection pipeline:
 *
 *   1) Extract amounts from normalized transactions
 *   2) Compute mean & standard deviation
 *   3) Compute category spending totals
 *   4) Build hour distribution (normal vs unusual hours)
 *   5) Compute weekly transaction frequency
 *   6) Score each transaction against all 5 risk signals
 *   7) Return updated transactions with anomalyScore & riskLevel
 *
 * This runs AFTER normalization and BEFORE MongoDB insertion.
 * Pure JavaScript — no ML libraries, no external services.
 */

const {
  calculateMean,
  calculateStdDev,
  groupAndSum,
  buildHourDistribution,
  calculateWeeklyFrequency,
} = require("../utils/statistics");

const { calculateRisk } = require("../utils/riskCalculator");

/**
 * Analyze an array of normalized transactions and assign anomaly scores.
 *
 * @param {Object[]} transactions - Normalized transactions (from normalizer.js)
 * @returns {Object[]} Same transactions with anomalyScore and riskLevel populated
 */
const analyzeTransactions = (transactions) => {
  // Edge case: empty or single transaction
  if (!transactions || transactions.length === 0) return [];

  if (transactions.length === 1) {
    // Cannot calculate meaningful statistics from a single transaction
    // Assign Normal risk since there's no deviation to measure
    return transactions.map((tx) => ({
      ...tx,
      anomalyScore: 0,
      riskLevel: "Normal",
    }));
  }

  console.log(`🔍 Analyzing ${transactions.length} transactions for anomalies...`);

  // ─── Step 1: Extract absolute amounts ───
  const amounts = transactions.map((tx) => Math.abs(tx.amount));

  // ─── Step 2: Compute mean & standard deviation ───
  const mean = calculateMean(amounts);
  const stdDev = calculateStdDev(amounts);

  console.log(`   📊 Amount stats: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)}`);

  // ─── Step 3: Compute category spending totals ───
  const categoryTotals = groupAndSum(transactions, "category", "amount");

  // Calculate average spending per category
  const categoryNames = Object.keys(categoryTotals);
  const categoryAvgSpending = {};

  if (categoryNames.length > 0) {
    const avgCategorySpend =
      calculateMean(Object.values(categoryTotals));

    for (const cat of categoryNames) {
      categoryAvgSpending[cat] = avgCategorySpend;
    }
  }

  console.log(`   📁 Categories found: ${categoryNames.length} (${categoryNames.join(", ")})`);

  // ─── Step 4: Build hour distribution ───
  const { peakHours } = buildHourDistribution(transactions);

  console.log(
    `   🕐 Peak hours: ${[...peakHours].sort((a, b) => a - b).join(", ")}`
  );

  // ─── Step 5: Compute weekly frequency ───
  const { weeklyAvg, currentWeekCount } = calculateWeeklyFrequency(transactions);

  console.log(
    `   📅 Weekly frequency: avg=${weeklyAvg.toFixed(1)}, current=${currentWeekCount}`
  );

  // ─── Step 6: Build stats object for risk calculator ───
  const stats = {
    mean,
    stdDev,
    peakHours,
    categoryTotals,
    categoryAvgSpending,
    weeklyAvg,
    currentWeekCount,
  };

  // ─── Step 7: Score each transaction ───
  let normalCount = 0;
  let mediumCount = 0;
  let highCount = 0;

  const analyzed = transactions.map((tx) => {
    const { anomalyScore, riskLevel, riskFactors } = calculateRisk(tx, stats);

    // Track distribution
    if (riskLevel === "Normal") normalCount++;
    else if (riskLevel === "Medium") mediumCount++;
    else highCount++;

    // Log flagged transactions
    if (anomalyScore > 0) {
      console.log(
        `   ⚠️  [${riskLevel}] Score ${anomalyScore}: ${tx.description || tx.category || "Unknown"} | ${riskFactors.join("; ")}`
      );
    }

    return {
      ...tx,
      anomalyScore,
      riskLevel,
    };
  });

  console.log(
    `✅ Anomaly analysis complete: ${normalCount} Normal, ${mediumCount} Medium, ${highCount} High`
  );

  return analyzed;
};

module.exports = { analyzeTransactions };
