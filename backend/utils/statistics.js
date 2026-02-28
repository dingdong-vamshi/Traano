/**
 * statistics.js — Pure JavaScript Statistical Functions
 *
 * Provides core math utilities for the anomaly detection engine.
 * All functions are deterministic, lightweight, and require no external libraries.
 */

/**
 * Calculate the arithmetic mean (average) of an array of numbers.
 *
 * @param {number[]} numbers - Array of numeric values
 * @returns {number} Mean value, or 0 if array is empty
 */
const calculateMean = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

/**
 * Calculate the population standard deviation.
 *
 * Measures how spread out values are from the mean.
 * A low stdDev means values cluster near the mean;
 * a high stdDev means values are widely spread.
 *
 * Formula: sqrt( Σ(xi - mean)² / N )
 *
 * @param {number[]} numbers - Array of numeric values
 * @returns {number} Standard deviation, or 0 if fewer than 2 values
 */
const calculateStdDev = (numbers) => {
  if (!numbers || numbers.length < 2) return 0;

  const mean = calculateMean(numbers);
  const squaredDiffs = numbers.map((val) => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / numbers.length;

  return Math.sqrt(avgSquaredDiff);
};

/**
 * Calculate the Z-score for a single value.
 *
 * Z-score tells how many standard deviations a value is from the mean.
 *   - Z = 0   → value equals the mean
 *   - |Z| = 1 → value is 1 std dev from mean (68% of data falls within)
 *   - |Z| = 2 → value is 2 std devs from mean (95% of data falls within)
 *   - |Z| = 3 → value is 3 std devs from mean (99.7% of data falls within)
 *
 * @param {number} value  - The value to score
 * @param {number} mean   - The population mean
 * @param {number} stdDev - The population standard deviation
 * @returns {number} Z-score, or 0 if stdDev is 0 (all values identical)
 */
const calculateZScore = (value, mean, stdDev) => {
  // Guard: if stdDev is 0, all values are identical — no deviation
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
};

/**
 * Group an array of objects by a key and sum a numeric field.
 *
 * @param {Object[]} items  - Array of objects
 * @param {string}   groupKey - Key to group by
 * @param {string}   sumKey   - Key to sum
 * @returns {Object} Map of groupValue → total
 */
const groupAndSum = (items, groupKey, sumKey) => {
  const groups = {};
  for (const item of items) {
    const key = item[groupKey] || "Unknown";
    if (!groups[key]) groups[key] = 0;
    groups[key] += Math.abs(item[sumKey] || 0);
  }
  return groups;
};

/**
 * Build a frequency distribution of hours (0-23) from transaction dates.
 *
 * @param {Object[]} transactions - Array with date fields
 * @returns {{ hourCounts: number[], peakHours: Set<number> }}
 */
const buildHourDistribution = (transactions) => {
  // Count transactions per hour (0-23)
  const hourCounts = new Array(24).fill(0);

  for (const tx of transactions) {
    if (tx.date instanceof Date && !isNaN(tx.date.getTime())) {
      const hour = tx.date.getHours();
      hourCounts[hour]++;
    }
  }

  // Find peak hours — hours with above-average activity
  const totalWithHours = hourCounts.reduce((a, b) => a + b, 0);
  if (totalWithHours === 0) {
    return { hourCounts, peakHours: new Set(Array.from({ length: 24 }, (_, i) => i)) };
  }

  const avgPerHour = totalWithHours / 24;

  const peakHours = new Set();
  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] >= avgPerHour * 0.5) {
      // Include hours with at least half the average frequency
      // This creates a generous "normal" window
      peakHours.add(h);
    }
  }

  // If fewer than 6 peak hours detected, expand to include adjacent hours
  if (peakHours.size < 6) {
    const expanded = new Set(peakHours);
    for (const h of peakHours) {
      expanded.add((h - 1 + 24) % 24);
      expanded.add((h + 1) % 24);
    }
    return { hourCounts, peakHours: expanded };
  }

  return { hourCounts, peakHours };
};

/**
 * Calculate weekly transaction counts for frequency analysis.
 *
 * @param {Object[]} transactions - Array with date fields
 * @returns {{ weeklyAvg: number, currentWeekCount: number, weeklyCounts: number[] }}
 */
const calculateWeeklyFrequency = (transactions) => {
  if (transactions.length === 0) {
    return { weeklyAvg: 0, currentWeekCount: 0, weeklyCounts: [] };
  }

  // Group transactions by ISO week
  const weekMap = {};
  let latestWeek = "";

  for (const tx of transactions) {
    if (!(tx.date instanceof Date) || isNaN(tx.date.getTime())) continue;

    const weekKey = getISOWeekKey(tx.date);
    weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;

    if (weekKey > latestWeek) latestWeek = weekKey;
  }

  const weeks = Object.keys(weekMap).sort();
  const weeklyCounts = weeks.map((w) => weekMap[w]);

  const weeklyAvg = calculateMean(weeklyCounts);
  const currentWeekCount = weekMap[latestWeek] || 0;

  return { weeklyAvg, currentWeekCount, weeklyCounts };
};

/**
 * Get an ISO week key string (YYYY-WXX) from a date.
 */
const getISOWeekKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
};

module.exports = {
  calculateMean,
  calculateStdDev,
  calculateZScore,
  groupAndSum,
  buildHourDistribution,
  calculateWeeklyFrequency,
};
