const express = require('express');
const config = require('../config');
const User = require('../controllers/user.controller');
const Profile = require('../controllers/profile.controller');

module.exports = ((config, user, profile) => {
  const route = express.Router();

  route.get('/me', async (req, res, next) => {
    const response = await profile.getProfileById(req.user);

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      ...response,
    });
  });

  route.get('/', async (req, res) => {
    const response = await user.getAllUsers();

    res.json({
      data: response,
    });
  });

  route.post('/', async (req, res, next) => {
    const response = await user.createUser({
      ...req.body,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.status(201).json({
      ...response,
    });
  });

  route.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await user.getUserById({
      id,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      ...response,
    });
  });

  route.get('/:id/transactions', async (req, res, next) => {
    const { id } = req.params;
    const response = await user.getUserByIdWithTransactions(
      {
        id,
      },
    );

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      ...response,
    });
  });

  route.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await user.updateUser({
      id,
      ...req.body,
    });

    if (response instanceof Error) {
      next(response);
      return;
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

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      ...response,
    });
  });

  return route;
})(config, User, Profile);
