const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});