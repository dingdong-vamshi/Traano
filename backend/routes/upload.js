const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  uploadStatement,
  getTransactions,
  getTransactionSummary,
} = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure Multer storage
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter — only allow CSV and PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and PDF files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Routes
router.post("/upload", authMiddleware, upload.single("statement"), uploadStatement);
router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/summary", authMiddleware, getTransactionSummary);

module.exports = router;
