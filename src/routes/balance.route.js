const express = require('express');
const config = require('../config');

const Balance = require('../controllers/balance.controller');

module.exports = ((config, balance) => {
  const route = express.Router();

  route.get('/', async (req, res) => {
    const response = await balance.getAllBalances();

    res.json({
      data: response,
    });
  });

  route.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await balance.getBalanceById({
      id,
    });

    // TODO: create middleware for error obtain
    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .status(200)
      .json({
        ...response,
      });
  });

  route.post('/', async (req, res) => {
    const { userId, amount, message, } = req.body;
    const response = await balance.createBalance({
      userId,
      amount,
      message,
    });

    res.status(201).json({
      ...response,
    });
  });

  route.put('/', async (req, res, next) => {
    const { userId, amount, message, } = req.body;
    const response = await balance.updateBalance({
      userId,
      amount,
      message,
    });

    res.json({
      ...response,
    })
  });

  route.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await balance.removeBalance({
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

  route.patch('/:balanceId', async (req, res) => {
    const { balanceId } = req.params;
    const { action, amount } = req.body;
    const response = await Balance[action]({
      balanceId,
      action,
      amount,
    });

    res.json({
      ...response,
    });
  });

  return route;
})(config, Balance);
