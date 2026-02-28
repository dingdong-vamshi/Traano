const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["debit", "credit", "unknown"],
      default: "unknown",
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    anomalyScore: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ["Normal", "Medium", "High"],
      default: "Normal",
    },
    uploadBatchId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

// Indexes for efficient queries
transactionSchema.index({ date: -1 });
transactionSchema.index({ uploadBatchId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ anomalyScore: -1 });
transactionSchema.index({ riskLevel: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
