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
  Food: ["swiggy", "zomato", "restaurant", "cafe", "doordash", "kfc", "mcdonald", "starbucks", "burger"],
  Transport: ["uber", "ola", "metro", "rapido", "fuel", "petrol", "bpcl", "hpcl", "indian oil", "auto"],
  Shopping: ["amazon", "amzn", "flipkart", "myntra", "meesho", "zara", "h&m", "retail", "store"],
  Utilities: ["electricity", "water", "gas", "recharge", "bbps", "rent", "broadband", "airtel", "jio", "vi", "bescom"],
  Entertainment: ["netflix", "spotify", "movie", "bookmyshow", "pvr", "inox"],
  Travel: ["airlines", "flight", "irctc", "makemytrip", "agoda", "booking", "hotel", "oyo"],
  Healthcare: ["hospital", "pharmacy", "apollo", "clinic", "medplus", "health"],
  Education: ["school", "college", "university", "udemy", "coursera", "byjus"],
  Groceries: ["blinkit", "zepto", "instamart", "reliance fresh", "supermarket", "wholefds", "more supermarket", "grocery", "dmart"],
  Others: ["salary", "zerodha", "groww", "investment", "tax", "loan", "emi", "bajaj finserv"]
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
