# 🚀 Project Name — Powerful Receipt Upload & Management App

A modern MERN-based application that allows users to upload receipts/bills, extract accurate data, store it in a database, and manage expenses efficiently. Designed with smooth UI/UX, fast backend APIs, and helpful toast notifications.

---

## 🧩 Problem Statement

Managing bills and receipts manually is time‑consuming, error‑prone, and messy. Users often face issues like:

* ❌ Receipts getting lost or damaged
* ❌ Extracted OCR data being incorrect
* ❌ Manually entering data repeatedly
* ❌ Not knowing the correct upload date
* ❌ Poor user feedback using `alert()` popups
* ❌ No centralized dashboard to view all uploaded receipts

This leads to **inaccurate expense tracking** and **bad user experience**.

---

## ✅ Our Solution

A fully automated **Receipt Upload & Data Extraction System** that:

* 📤 Allows users to upload receipt images easily
* 🔍 Uses OCR to extract accurate text from bills
* 📅 Automatically saves **current date** of upload
* 🛢 Stores extracted info securely in MongoDB
* 🔔 Uses toast notifications instead of alerts for a smooth experience
* 📊 Provides an organized admin dashboard to view all uploads
* ⚡ Fast, reliable, and user‑friendly

---

## ✨ Features & Functionalities

### 🔹 Receipt Upload

* Upload PNG/JPG/JPEG files
* Real‑time file preview
* Auto‑capture today’s date

### 🔹 OCR Text Extraction

* Extracts bill amount, date, vendor name, items, etc.
* Highly accurate extraction using improved processing

### 🔹 Automatic Date Handling

* System automatically stores **today's date** when a user uploads
* No manual date selection required

### 🔹 Toast Notifications (No More Alerts!)

* Success toast: Upload successful
* Error toast: Invalid file or server error
* Loading toast: Processing receipt

Example:

```jsx
import toast from "react-hot-toast";
toast.success("Receipt uploaded successfully!");
```

### 🔹 Secure Backend APIs

* Built using Node.js + Express
* Validates file format and size
* Sends clean extracted data to database

### 🔹 Mongoose Database Integration

* Stores:

  * File name
  * OCR extracted text
  * Auto-generated upload date
  * User id (optional)

### 🔹 Admin Dashboard

* View all uploaded receipts
* Search, sort, filter receipts
* Graph summary of total uploads per day/month

### 🔹 Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Hot Toast
**Backend:** Node.js, Express.js, Multer (file upload)
**Database:** MongoDB + Mongoose
**OCR:** Tesseract.js (or any preferred OCR engine)
**Graph:** Recharts (Admin Analytics)

---

## 📂 Folder Structure

```
root
│── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── uploads
│   └── server.js
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── hooks
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ How It Works (Flow)

1. User uploads a bill image
2. Frontend shows a **loading toast**
3. File sent to backend via API
4. OCR extracts important information
5. Backend stores:

   * Extracted text
   * Image path
   * **Today's date automatically**
6. Frontend shows a **success toast**
7. Data appears instantly on dashboard

---

## 🚀 Future Enhancements

* AI‑based smart categorization of expenses
* Auto‑detect currency, GST, totals
* Export dashboard as PDF/Excel
* Multi‑user login system
* Mobile app version

---

## 🤝 Contributing

Pull requests are welcome! If you find a bug or want a new feature, feel free to open an issue.

---

## 📜 License

This project is open‑source and available under the **MIT License**.

---

## ❤️ Acknowledgements

* React Hot Toast for beautiful notifications
* MongoDB & Express for backend power
* Tesseract.js for text extraction
* Tailwind CSS for fast UI styling
