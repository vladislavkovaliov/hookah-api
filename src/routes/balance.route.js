const express = require('express');
const config = require('../config');

const Balance = require('../controllers/balance.controller');

module.exports = ((config, balance) => {
  const route = express.Router();

  route.get('/', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const pageSize = limit;
    const response = await balance.getAllBalances([
      { $skip: pageSize * (page - 1), },
      { $limit: parseInt(limit, 10), }
    ]);

    res.json({
      data: response,
      limit,
      page,
      totalPages: Math.ceil(await balance.getCount() / limit),
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

  route.post('/', async (req, res, next) => {
    const { userId, amount, message, } = req.body;
    const response = await balance.createBalance({
      userId,
      amount,
      message,
    });

    // TODO: create middleware for error obtain
    if (response instanceof Error) {
      next(response);
      return;
    }

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

    // TODO: create middleware for error obtain
    if (response instanceof Error) {
      next(response);
      return;
    }

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

  route.patch('/:balanceId', async (req, res, next) => {
    const { balanceId } = req.params;
    const { action, amount } = req.body;
    const response = await Balance[action]({
      balanceId,
      action,
      amount,
    });

    // TODO: create middleware for error obtain
    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      ...response,
    });
  });

  return route;
})(config, Balance);
