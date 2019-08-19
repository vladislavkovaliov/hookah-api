const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  amount: Number,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("Balance", balanceSchema);
