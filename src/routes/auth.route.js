const express = require('express');
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');

const config = require('../config');
const Auth = require('../controllers/auth.controller');
const User = require('../controllers/user.controller');
const UserModel = require('../models/user.model');
const BalanceModel = require('../models/balance.model');

module.exports = ((config, auth, passport) => {
  const route = express.Router();

  passport.use(
    new JwtStrategy({
      jwtFromRequest: (req) => {
        return req.header('hookah-jwt');
      },
      secretOrKey: 'secret',
    },
    function (jwt_payload, done) {
      done(null, jwt_payload);
    },
  ));

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

  return route;
})(config, Auth, passport);
