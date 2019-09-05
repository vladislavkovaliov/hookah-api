const express = require('express');
const passport = require('passport');
const config = require('../config');
const Auth = require('../controllers/auth.controller');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/user.model');
const BalanceModel = require('../models/balance.model');
const mongoose = require('mongoose');

module.exports = ((config, auth, passport, UserModel, BalanceModel) => {
  const route = express.Router();


  route.post('/login', async (req, res, next) => {
    const { email, password, strategy = 'jwt' } = req.body;
    const response = await auth.login({
      email,
      password,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    // res.;
    res.header('hookah-jwt', response.token).status(200).json({
      ...response,
    });
  });

  route.post('/register', async (req, res) => {
    const { email, password, strategy = 'jwt' } = req.body;
    const response = await auth.register({
      email,
      password,
    });

    res.status(201).json({
      ...response,
    });
  });

  route.delete('/logout', async (req, res) => {
    const token = req.headers['hookah-jwt'];
    const response = await auth.logout(token);

    res.json({
      ...response,
    });
  });

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

  route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  route.get(
    '/google/redirect',
    passport.authenticate('google'),
    (req, res) => {
      console.log(42);
      console.log(req.user);
      res.redirect(`/api/users/${req.user._id}`);
    },
  );

  return route;
})(config, Auth, passport, UserModel, BalanceModel);
