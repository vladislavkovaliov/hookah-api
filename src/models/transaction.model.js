const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
