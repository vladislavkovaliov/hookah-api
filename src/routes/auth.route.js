const express = require('express');
const config = require('../config');

const Auth = require('../controllers/auth.controller');

module.exports = ((config, auth) => {
  const route = express.Router();

  route.post('/login', async (req, res) => {
    const { email, password, strategy = 'jwt' } = req.body;
    const response = await auth.login({
      email,
      password,
    });

    res.header('hookah-jwt', response.token);

    res.status(200).json({
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
})(config, Auth);
