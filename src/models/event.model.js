const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    startDate: Date,
    endDate: Date,
    attendants: Array,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
