const fs = require("fs");
const csv = require("csv-parser");

exports.handleUpload = (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      // Extract important fields
      const transaction = {
        date: row.Date || row.date,
        description: row.Description || row.Narration,
        amount: row.Amount || row.Debit || row.Credit,
      };

      results.push(transaction);
    })
    .on("end", () => {
      res.json({
        message: "File processed successfully",
        totalTransactions: results.length,
        transactions: results,
      });
    });
};