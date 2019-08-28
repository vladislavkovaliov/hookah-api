const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { InvalidLoginCredentialsError } = require('../errors');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, expires: '30s', default: Date.now },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },
}, { timestamps: true });
// userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60000 / 60 });

/**
 * Password hash middleware.
 */
// userSchema.pre("save", function save(next) {
//   const user = this as UserDocument;
//
//   if (!user.isModified("password")) { return next(); }
//
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) { return next(err); }
//
//     bcrypt.hash(user.password, salt, undefined, (err, hash) => {
//       if (err) { return next(err); }
//
//       user.password = hash;
//       next();
//     });
//   });
// });

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign(
    { _id: user._id },
    'secret13',
  );

  user.tokens = user.tokens.concat(token);

  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new InvalidLoginCredentialsError();
  }

  const isPasswordMatch = password === user.password;
  if (!isPasswordMatch) {
    throw new InvalidLoginCredentialsError();
  }

  return user;
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
