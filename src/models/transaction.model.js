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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Transaction', transactionSchema);
