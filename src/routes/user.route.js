const express = require('express');
const config = require('../config');

const User = require('../controllers/user.controller');

module.exports = ((config, user) => {
  const route = express.Router();

  route.get('/', async (req, res) => {
    const response = await user.getAllUsers();

    res.json({
      ...response,
    });
  });

  return route;
})(config, User);
