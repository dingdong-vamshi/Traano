const mongoose = require("mongoose");

const merchantCategorySchema = new mongoose.Schema(
  {
    merchantName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    source: {
      type: String,
      enum: ["rule", "gemini", "manual"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

merchantCategorySchema.index({ merchantName: 1 });

module.exports = mongoose.model("MerchantCategory", merchantCategorySchema);
