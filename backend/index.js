const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ✔ Serve uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer Storage – used for <input name="receipt" />
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const upload = multer({ storage });

// MongoDB Model
const Expense = require("./Models/Expense");

// ------------------------------
// 🔵 OCR UPLOAD ROUTE
// ------------------------------
app.post("/api/upload", upload.single("receipt"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, req.file.path);
  console.log("📄 Uploaded file:", imagePath);

  const python = spawn("python", [
    path.join(__dirname, "../ocr-service/ocr.py"),
    imagePath,
  ]);

  let ocrOutput = "";

  python.stdout.on("data", (data) => {
    ocrOutput += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("❌ Python Error:", data.toString());
  });

  python.on("close", async () => {
    try {
      const result = JSON.parse(ocrOutput);

      // ✔ FIXED — correct public URL for frontend
      result.image = `/uploads/${req.file.filename}`;

      const expense = new Expense(result);
      await expense.save();

      res.json(result);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      res.status(500).json({ error: "Failed to process OCR output" });
    }
  });
});

// ------------------------------
// 🟢 MANUAL INSERT
// ------------------------------
app.post("/api/manual", async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json({ message: "Added Successfully" });
});

// ------------------------------
// 🟣 FETCH ALL EXPENSES
// ------------------------------
app.get("/api/expenses", async (req, res) => {
  const data = await Expense.find().sort({ date: -1 });
  res.json(data);
});

// ------------------------------
// 🟠 MONGO CONNECTION
// ------------------------------
mongoose
  .connect("mongodb://localhost:27017/finance")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ------------------------------
// 🟢 START SERVER
// ------------------------------
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
