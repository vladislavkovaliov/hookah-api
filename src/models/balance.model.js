const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true,
    },
    amount: {
      type: Number,
    },
    message: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Balance", balanceSchema);
