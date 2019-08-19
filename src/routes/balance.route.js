const express = require('express');
const config = require('../config');

const Balance = require('../controllers/balance.controller');

module.exports = ((config, balance) => {
  const route = express.Router();

  route.get('/', async (req, res) => {
    const response = await balance.getAllBalances();

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
