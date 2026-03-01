const express = require("express");
const router = express.Router();
const MerchantCategory = require("../models/MerchantCategory");
const authMiddleware = require("../middlewares/authMiddleware");
const { allowedCategories } = require("../services/categoryService");

/**
 * PUT /api/category/override
 *
 * Allows manual override of a merchant's category by the user.
 * Body: { merchantName: string, category: string }
 */
router.put("/override", authMiddleware, async (req, res) => {
  try {
    const { merchantName, category } = req.body;

    if (!merchantName || !category) {
      return res.status(400).json({
        success: false,
        error: "Both merchantName and category are required."
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`
      });
    }

    const normalizedMerchant = merchantName.toLowerCase().trim();

    // Update or insert manual override
    const updated = await MerchantCategory.findOneAndUpdate(
      { merchantName: normalizedMerchant },
      { merchantName: normalizedMerchant, category, source: "manual" },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Category overriden successfully."
    });
  } catch (error) {
    console.error("Override Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to override category.",
      message: error.message
    });
  }
});

module.exports = router;
