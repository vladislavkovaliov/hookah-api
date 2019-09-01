const mongoose = require('mongoose');

const attendantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      require: true,
    },
    guests: {
      type: Array,
      default: [],
    },
  },
  { timestamp: true },
);

module.exports = mongoose.model("Attendant", attendantSchema);
