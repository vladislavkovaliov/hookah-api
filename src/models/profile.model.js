const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { InvalidLoginCredentialsError } = require('../errors');

const profileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      default: 'No name'
    },
    password: {
      type: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    imageUrl: {
      type: String,
      default: 'https://gravatar.com/avatar/?s=200&d=retro',
    },
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
  },
  { timestamps: true },
);

profileSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
    { _id: user._id },
    'secret',
  );

  user.tokens = user.tokens.concat(token);

  await user.save();

  return token;
};

profileSchema.statics.findByCredentials = async (email, password) => {
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

profileSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne(
    {
      email,
    },
  );

  return user;
};

profileSchema.methods.gravatar = function (size = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model("Profile", profileSchema);

module.exports = User;
