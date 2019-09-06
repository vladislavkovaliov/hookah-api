const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { InvalidLoginCredentialsError } = require('../errors');

const userSchema = new mongoose.Schema(
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
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret',
  );
};

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

userSchema.statics.findByCredentials = async (email, password) => {
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

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne(
    {
      email,
    },
  );

  return user;
};

userSchema.methods.gravatar = function (size = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
