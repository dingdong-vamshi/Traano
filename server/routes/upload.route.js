const express = require("express");
const router = express.Router();
const multer = require("multer");
const { handleUpload } = require("../controllers/upload.controller");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), handleUpload);

module.exports = router;