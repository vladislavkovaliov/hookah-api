const mongoose = require('mongoose');

const attendantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      require: true,
    },
    guests: {
      type: Array,
      default: [{}],
    },
  },
  { timestamp: true },
);

const Attendant = mongoose.model("Attendant", attendantSchema);

module.exports = Attendant;
