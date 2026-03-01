const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Traano Backend is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);

  // Multer file type errors
  if (err.message === "Only CSV and PDF files are allowed.") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Multer file size errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File size exceeds the 50MB limit.",
    });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Data validation failed.",
      details: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: "Internal server error.",
    message: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables.");
  process.exit(1);
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Traano Backend running on http://localhost:${PORT}`);
  });
});
