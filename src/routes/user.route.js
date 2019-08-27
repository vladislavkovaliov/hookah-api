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

  route.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const response = await user.createUser({
      email,
      password,
    });

    if (response.code) {
      next(response);
    }

    res.json({
      ...response,
    });
  });

  route.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await user.getUserById({
      id,
    });

    if (response.code) {
      next(response);
    }

    res.json({
      ...response,
    });
  });

  route.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { email, password } = req.body;
    const response = await user.updateUser({
      id,
      email,
      password,
    });

    if (response.code) {
      next(response);
    }

    res.json({
      ...response,
    });
  });

  route.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await user.removeUser({
      id,
    });

    if (response.code) {
      next(response);
    }

    res.json({
      ...response,
    });
  });

  return route;
})(config, User);
