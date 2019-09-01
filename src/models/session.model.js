const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      unique: true
    },
    token: {
      type: String,
      unique: true
    },
  },
  { timestamps: true },
);

sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 10 },
);

const SessionModel = mongoose.model("Session", sessionSchema);

// TODO: needs investigate
// SessionModel.watch().on('change', change => console.log(change));

module.exports = SessionModel;
