const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Transaction', transactionSchema);
