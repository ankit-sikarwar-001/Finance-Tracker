const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(
  cors({
    origin: [
      "https://finance-tracker-fawn-five.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// MULTER CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "finance_bills",
    format: () => "jpg",
    public_id: (req, file) =>
      path.parse(file.originalname).name + "-" + Date.now(),
  },
});
const upload = multer({ storage });

// MODEL
const Expense = require("./Models/Expense");

// ---------------------------
// 🚀 UPLOAD + OCR ROUTE
// ---------------------------
app.post("/api/upload", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageURL = req.file.path;
    console.log("🖼️ Uploaded →", imageURL);

    // Python OCR path
    const pythonScript = path.join(__dirname, "ocr-service/ocr.py");

    const python = spawn("python3", [pythonScript, imageURL]);

    let ocrOutput = "";

    python.stdout.on("data", (data) => {
      ocrOutput += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("❌ OCR Error:", data.toString());
    });

    python.on("close", async () => {
      try {
        const result = JSON.parse(ocrOutput);
        result.image = imageURL; // Cloudinary URL

        const expense = new Expense(result);
        await expense.save();

        res.json(expense);
      } catch (err) {
        console.error("❌ Failed Parsing OCR Output");
        res.status(500).json({ error: "OCR Processing Error" });
      }
    });
  } catch (err) {
    console.error("❌ Upload Route Failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// ➕ Manual Add
// ---------------------------
app.post("/api/manual", async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json(newExpense);
});

// ---------------------------
// 📌 Fetch All
// ---------------------------
app.get("/api/expenses", async (req, res) => {
  const data = await Expense.find().sort({ date: -1 });
  res.json(data);
});

// ---------------------------
// 🟢 MongoDB
// ---------------------------
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ---------------------------
// 🚀 Start Server
// ---------------------------
app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on Render...")
);
