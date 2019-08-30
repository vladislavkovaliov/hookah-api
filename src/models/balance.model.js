const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, unique: true },
  amount: Number,
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model("Balance", balanceSchema);
