const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      default: null,
    },
    attendants: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
