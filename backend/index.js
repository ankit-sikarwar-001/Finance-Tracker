const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

// CLOUDINARY SETUP
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());

// MULTER CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "finance_bills",
    format: async () => "jpg",
    public_id: (req, file) =>
      path.parse(file.originalname).name + "-" + Date.now(),
  },
});

const upload = multer({ storage });

// MongoDB Model
const Expense = require("./Models/Expense");

// ------------------------------
// 🔵 OCR UPLOAD ROUTE
// ------------------------------
app.post("/api/upload", upload.single("receipt"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageURL = req.file.path;
  console.log("🖼️ Uploaded to Cloudinary URL:", imageURL);

  // ✅ UPDATED PATH FOR DEPLOYMENT
  const pythonPath = path.join(__dirname, "ocr-service/ocr.py");

  const python = spawn("python", [pythonPath, imageURL]);

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

      result.image = imageURL; // store Cloudinary image

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
  .connect(process.env.DB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ------------------------------
// 🟢 START SERVER
// ------------------------------
app.listen(process.env.PORT || 5000, () => console.log("Server running..."));
