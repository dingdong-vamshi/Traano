/**
 * riskCalculator.js — Risk Scoring and Classification
 *
 * Calculates anomaly risk points for each transaction based on
 * multiple statistical signals. Each signal contributes independently
 * to the total risk score, making the scoring fully explainable.
 *
 * SCORING BREAKDOWN:
 * ───────────────────────────────────────────
 * Signal                      Points
 * ───────────────────────────────────────────
 * Amount Z-Score > 2           +25
 * Amount Z-Score > 3           +40  (replaces 25)
 * High Value (> 2x avg)        +30
 * Unusual Hour                 +15
 * Category Spike (> 40%)       +20
 * Frequency Spike (> 30%)      +20
 * ───────────────────────────────────────────
 * Max possible per txn:         105
 *
 * CLASSIFICATION:
 *   0–29   → "Normal"
 *  30–59   → "Medium"
 *  60+     → "High"
 */

// ==================== THRESHOLDS ====================
// These can be adjusted without changing logic

const THRESHOLDS = {
  // Z-Score thresholds for amount deviation
  ZSCORE_MODERATE: 2,       // 2 std devs from mean
  ZSCORE_EXTREME: 3,        // 3 std devs from mean

  // Risk points for each signal
  POINTS_ZSCORE_MODERATE: 25,
  POINTS_ZSCORE_EXTREME: 40,
  POINTS_HIGH_VALUE: 30,
  POINTS_UNUSUAL_HOUR: 15,
  POINTS_CATEGORY_SPIKE: 20,
  POINTS_FREQUENCY_SPIKE: 20,

  // Detection thresholds
  HIGH_VALUE_MULTIPLIER: 2,       // Flag if amount > 2x average
  CATEGORY_SPIKE_PERCENT: 0.40,   // Flag if category > 40% above avg
  FREQUENCY_SPIKE_PERCENT: 0.30,  // Flag if weekly count > 30% above avg

  // Classification boundaries
  RISK_MEDIUM_MIN: 30,
  RISK_HIGH_MIN: 60,
};

/**
 * Calculate the anomaly risk score for a single transaction.
 *
 * @param {Object} transaction - Normalized transaction
 * @param {Object} stats - Pre-computed statistics for the batch:
 *   - mean: number
 *   - stdDev: number
 *   - peakHours: Set<number>
 *   - categoryAvgSpending: Object  { category → avgAmount }
 *   - categoryTotals: Object       { category → totalAmount }
 *   - weeklyAvg: number
 *   - currentWeekCount: number
 * @returns {{ anomalyScore: number, riskLevel: string, riskFactors: string[] }}
 */
const calculateRisk = (transaction, stats) => {
  let score = 0;
  const riskFactors = [];

  const amount = Math.abs(transaction.amount);

  // ─── 1. Amount Deviation (Z-Score) ───
  if (stats.stdDev > 0) {
    const zScore = Math.abs((amount - stats.mean) / stats.stdDev);

    if (zScore > THRESHOLDS.ZSCORE_EXTREME) {
      score += THRESHOLDS.POINTS_ZSCORE_EXTREME;
      riskFactors.push(`Extreme amount deviation (Z=${zScore.toFixed(2)})`);
    } else if (zScore > THRESHOLDS.ZSCORE_MODERATE) {
      score += THRESHOLDS.POINTS_ZSCORE_MODERATE;
      riskFactors.push(`High amount deviation (Z=${zScore.toFixed(2)})`);
    }
  }

  // ─── 2. High Value Detection ───
  if (stats.mean > 0 && amount > stats.mean * THRESHOLDS.HIGH_VALUE_MULTIPLIER) {
    score += THRESHOLDS.POINTS_HIGH_VALUE;
    riskFactors.push(
      `High value transaction (${amount.toFixed(0)} vs avg ${stats.mean.toFixed(0)})`
    );
  }

  // ─── 3. Unusual Time Detection ───
  if (
    transaction.date instanceof Date &&
    !isNaN(transaction.date.getTime()) &&
    stats.peakHours &&
    stats.peakHours.size > 0
  ) {
    const hour = transaction.date.getHours();
    if (!stats.peakHours.has(hour)) {
      score += THRESHOLDS.POINTS_UNUSUAL_HOUR;
      riskFactors.push(`Unusual hour (${hour}:00, outside normal activity)`);
    }
  }

  // ─── 4. Category Spike Detection ───
  const category = transaction.category || "Uncategorized";
  if (
    stats.categoryTotals &&
    stats.categoryAvgSpending &&
    stats.categoryAvgSpending[category] !== undefined
  ) {
    const catTotal = stats.categoryTotals[category] || 0;
    const catAvg = stats.categoryAvgSpending[category];

    if (catAvg > 0 && catTotal > catAvg * (1 + THRESHOLDS.CATEGORY_SPIKE_PERCENT)) {
      score += THRESHOLDS.POINTS_CATEGORY_SPIKE;
      riskFactors.push(
        `Category spending spike: ${category} (${((catTotal / catAvg - 1) * 100).toFixed(0)}% above avg)`
      );
    }
  }

  // ─── 5. Frequency Change Detection ───
  if (
    stats.weeklyAvg > 0 &&
    stats.currentWeekCount > stats.weeklyAvg * (1 + THRESHOLDS.FREQUENCY_SPIKE_PERCENT)
  ) {
    score += THRESHOLDS.POINTS_FREQUENCY_SPIKE;
    riskFactors.push(
      `Weekly frequency spike (${stats.currentWeekCount} txns vs avg ${stats.weeklyAvg.toFixed(1)})`
    );
  }

  // ─── Classify ───
  const riskLevel = classifyRisk(score);

  return {
    anomalyScore: score,
    riskLevel,
    riskFactors,
  };
};

/**
 * Classify a numeric risk score into a human-readable level.
 *
 * @param {number} score - Total risk points
 * @returns {string} "Normal" | "Medium" | "High"
 */
const classifyRisk = (score) => {
  if (score >= THRESHOLDS.RISK_HIGH_MIN) return "High";
  if (score >= THRESHOLDS.RISK_MEDIUM_MIN) return "Medium";
  return "Normal";
};

module.exports = { calculateRisk, classifyRisk, THRESHOLDS };
