const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  merchant: String,
  amount: Number,
  category: String,
  date: Date,
  image: String,
});

module.exports = mongoose.model("Expense", ExpenseSchema);
