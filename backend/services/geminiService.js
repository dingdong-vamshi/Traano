const { GoogleGenerativeAI } = require("@google/generative-ai");

const categorizeWithGemini = async (merchantName) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  No GEMINI_API_KEY provided. Falling back to Others.");
    return "Others";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Categorize the following transaction merchant into one of:
Food, Transport, Shopping, Utilities, Entertainment, Travel, Healthcare, Education, Groceries, Others.

Merchant:
"${merchantName}"

Respond with ONLY the category name.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Safety check just in case it replies with a sentence
    const allowedCategories = [
      "Food", "Transport", "Shopping", "Utilities", "Entertainment", 
      "Travel", "Healthcare", "Education", "Groceries", "Others"
    ];

    const match = allowedCategories.find(c => text.toLowerCase().includes(c.toLowerCase()));
    return match || "Others";

  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    return "Others";
  }
};

module.exports = { categorizeWithGemini };
