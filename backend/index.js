const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
// fs and path are no longer needed for local storage
// const fs = require("fs");

// ** 1. CLOUDINARY SETUP **
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());

// ❌ Removed: Serving /uploads folder publicly (no longer stored locally)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ❌ Removed: Ensuring uploads folder exists
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// ** 2. MULTER CLOUDINARY STORAGE **
// Multer Storage – replacing diskStorage with CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "finance_bills", // Your specified folder on Cloudinary
    format: async (req, file) => "jpg", // forces all images to jpg
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

  // ** CHANGE 1: Accessing Cloudinary URL **
  // req.file now contains the file information from Cloudinary
  const imageURL = req.file.path; // This is the public URL from Cloudinary
  console.log("🖼️ Uploaded to Cloudinary URL:", imageURL);

  // ** CHANGE 2: Pass the public URL to Python script **
  // Note: Your Python script must now be able to download the image from this URL.
  // If your OCR service runs on a local machine without internet access, this will fail.
  // A robust solution would be to pass the image data/buffer, but for a direct URL replacement:

  const python = spawn("python", [
    path.join(__dirname, "../ocr-service/ocr.py"),
    imageURL, // Passing the Cloudinary URL instead of local path
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

      // ** CHANGE 3: Store Cloudinary URL in MongoDB **
      result.image = imageURL; // Store the public Cloudinary URL

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
  // The 'image' field in 'data' will now contain the Cloudinary URL,
  // which the frontend can use directly.
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
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
