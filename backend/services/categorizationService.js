const ALLOWED_CATEGORIES = [
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

const extractMerchant = (description) => {
  if (!description) return "Unknown";
  
  // Basic heuristic: take textual part until special delimiters
  let cleaned = description.split(/[0-9\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\\\|\;\:\'\"\,\.\/\<\>\?]{1,}/)[0].trim();
  
  if (cleaned.length < 2) {
    // If empty or too short, fallback to hyphen/slash split
    cleaned = description.split(/[\-\/]/)[0].trim();
  }
  
  return cleaned.substring(0, 30);
};

// Fallback categorization using simple keywords if Gemini API is missing
const categorizeTransaction = async (merchant) => {
  const lowerDesc = merchant.toLowerCase();
  
  if (lowerDesc.includes("uber") || lowerDesc.includes("ola") || lowerDesc.includes("rapido") || lowerDesc.includes("fuel") || lowerDesc.includes("petrol") || lowerDesc.includes("irctc")) return "Transport";
  if (lowerDesc.includes("swiggy") || lowerDesc.includes("zomato") || lowerDesc.includes("cafe") || lowerDesc.includes("restaurant") || lowerDesc.includes("kfc") || lowerDesc.includes("mcdonalds")) return "Food";
  if (lowerDesc.includes("amazon") || lowerDesc.includes("flipkart") || lowerDesc.includes("myntra") || lowerDesc.includes("zara") || lowerDesc.includes("hm")) return "Shopping";
  if (lowerDesc.includes("netflix") || lowerDesc.includes("prime") || lowerDesc.includes("spotify") || lowerDesc.includes("hotstar")) return "Entertainment";
  if (lowerDesc.includes("blinkit") || lowerDesc.includes("zepto") || lowerDesc.includes("instamart") || lowerDesc.includes("reliance fresh") || lowerDesc.includes("groceries") || lowerDesc.includes("supermarket")) return "Groceries";
  if (lowerDesc.includes("hospital") || lowerDesc.includes("pharmacy") || lowerDesc.includes("apollo") || lowerDesc.includes("clinic") || lowerDesc.includes("medplus")) return "Healthcare";
  if (lowerDesc.includes("electricity") || lowerDesc.includes("bescom") || lowerDesc.includes("water") || lowerDesc.includes("gas") || lowerDesc.includes("recharge") || lowerDesc.includes("airtel") || lowerDesc.includes("jio")) return "Utilities";
  if (lowerDesc.includes("makemytrip") || lowerDesc.includes("indigo") || lowerDesc.includes("agoda") || lowerDesc.includes("booking")) return "Travel";
  if (lowerDesc.includes("school") || lowerDesc.includes("college") || lowerDesc.includes("university") || lowerDesc.includes("udemy") || lowerDesc.includes("coursera")) return "Education";

  return "Others";
};

module.exports = {
  ALLOWED_CATEGORIES,
  extractMerchant,
  categorizeTransaction,
};
