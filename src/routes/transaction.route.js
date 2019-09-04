const express = require('express');
const config = require('../config');
const Transaction = require('../controllers/transaction.controller');

module.exports = ((config, transaction) => {
  const route = express.Router();

  route.get('/', async (req, res, next) => {
    const response = await transaction.getAllTransaction();

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      data: response,
    });
  });

  route.get('/:id', async (req, res, next) => {
    const response = await transaction.getTransactionById({
      _id: req.params.id,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .json({
        ...response,
      });
  });

  route.post('/', async (req, res, next) => {
    const { amount, userId, } = req.body;
    const response = await transaction.createTransaction({
      amount,
      userId,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .status(201)
      .json({
        ...response,
      });
  });

  route.put('/:id', async (req, res, next) => {
    const { id, } = req.params;
    const { amount, userId, } = req.body;
    const response = await transaction.updateTransaction({
      _id: id,
      amount,
      userId,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .json({
        ...response,
      });
  });

  route.delete('/:id', async (req, res, next) => {
    const { id, } = req.params;
    const response = await transaction.removeTransaction({
      _id: id,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .json({
        ...response,
      });
  });

  return route;
})(config, Transaction);
