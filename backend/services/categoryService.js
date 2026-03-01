const MerchantCategory = require("../models/MerchantCategory");
const { categorizeWithGemini } = require("./geminiService");

const allowedCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Travel",
  "Healthcare",
  "Education",
  "Groceries",
  "Others"
];

const categoryRules = {
  Food: ["swiggy", "zomato", "restaurant", "cafe"],
  Transport: ["uber", "ola", "metro", "rapido"],
  Shopping: ["amazon", "flipkart", "myntra"],
  Utilities: ["electricity", "water", "gas", "recharge"],
  Entertainment: ["netflix", "spotify", "movie"],
  Travel: ["airlines", "flight", "irctc"]
};

// Extracts merchant from description safely
const extractMerchant = (description) => {
  if (!description) return null;
  
  let cleaned = description.split(/[0-9\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\\\|\;\:\'\"\,\.\/\<\>\?]{1,}/)[0].trim();
  
  if (cleaned.length < 2) {
    cleaned = description.split(/[\-\/]/)[0].trim();
  }
  
  return cleaned.substring(0, 50);
};

// Rule-based categorization
const matchRuleBased = (merchant) => {
  if (!merchant) return null;
  const lowerDesc = merchant.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryRules)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }
  return null;
};

// The Hybrid Categorization Function
async function getCategory(transaction, mappedCategory) {
  // 1) Keep description unchanged
  // 2) If mappedCategory exists, check for explicit CSV category
  if (mappedCategory && transaction[mappedCategory]) {
    const csvCategoryRaw = transaction[mappedCategory].toString().trim();
    
    // Validate against allowed categories
    const matchedCategory = allowedCategories.find(
      (c) => c.toLowerCase() === csvCategoryRaw.toLowerCase()
    );
    
    if (matchedCategory) {
      return matchedCategory;
    }
  }

  // 3) Extract merchant from description
  const merchantRaw = extractMerchant(transaction.description);
  
  if (!merchantRaw) {
    return "Others";
  }

  const merchantName = merchantRaw.toLowerCase();

  // 4) Check DB Cache First (including 'manual' overrides)
  try {
    const existing = await MerchantCategory.findOne({ merchantName });
    if (existing) {
      return existing.category;
    }
  } catch (error) {
    console.warn("⚠️ Exception while checking DB cache:", error.message);
  }

  // 5) Rule-based match
  const ruleMatch = matchRuleBased(merchantName);
  if (ruleMatch) {
    try {
      await MerchantCategory.create({
        merchantName,
        category: ruleMatch,
        source: "rule"
      });
    } catch (ignore) {} // Ignore bulk/unique violations during rapid inserts
    
    return ruleMatch;
  }

  // 6) Gemini fallback
  const geminiCategory = await categorizeWithGemini(merchantName);
  
  try {
    await MerchantCategory.create({
      merchantName,
      category: geminiCategory,
      source: "gemini"
    });
  } catch (ignore) {} // Ignore unique violations
  
  return geminiCategory;
}

module.exports = {
  allowedCategories,
  getCategory,
  extractMerchant
};
