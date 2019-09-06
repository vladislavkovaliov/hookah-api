const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('../config');
const Auth = require('../controllers/auth.controller');
const User = require('../controllers/user.controller');
const UserModel = require('../models/user.model');
const BalanceModel = require('../models/balance.model');

module.exports = ((config, auth, passport, UserModel, BalanceModel) => {
  const route = express.Router();

  passport.use(
    new GoogleStrategy({
        clientID: '711910026758-c1dm2dancrtapi575ffvd6et6n8sil3j.apps.googleusercontent.com',
        clientSecret: 'SZbniRnZYfZMGt_ucy4Uc7zP',
        callbackURL: '/api/auth/google/redirect',
      },
      async function(accessToken, refreshToken, profile, done) {
        const filter = { email: profile.emails[0].value, };
        let user = await UserModel.findOne({ ...filter, });
        if (!user) {
          user = await UserModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            google: profile.id,
          });
          const objectId = mongoose.Types.ObjectId(user._id);
          await BalanceModel.create({
            userId: objectId,
            amount: 0,
            message: '',
          });
        }
        const result = await UserModel.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(user._id),
            },
          },
          {
            $lookup: {
              from: 'balances',
              localField: '_id',
              foreignField: 'userId',
              as: 'balance',
            },
          },
          {
            $unwind: {
              path: '$balance',
            },
          },
        ]);
        console.log(result);
        done(null, result[0]);
      }
    ));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    const filter = {
      email: user.email,
    };
    const result = await UserModel.findOne(filter);
    if (!result) {
      done(null, user);
    }
  });

  route.get(
    '/google',
    passport.authenticate(
      'google',
      {
        scope: ['profile', 'email'],
      },
    ));

  route.get(
    '/google/redirect',
    passport.authenticate('google'),
    async (req, res) => {
      const user = await User.getUserById({
        id: req.user._id,
      });

      res.json(user);
    },
  );

  return route;
})(config, Auth, passport, UserModel, BalanceModel, User);
