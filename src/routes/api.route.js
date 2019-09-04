const express = require('express');
const config = require('../config');

const Api = require('../controllers/api.controller');

module.exports = ((config, api) => {
  const route = express.Router();

  route.get('/ping', (req, res) => {
    const response = api.getPing();

    res.json(
      response,
    );
  });

  route.get('/config', (req, res) => {
    const response = api.getConfig();

    res.json(
      response,
    );
  });

  route.post('/client', async (req, res) => {
    res.json(req.body);
  });

  route.post('/push', async (req, res, next) => {
    const response = await api.push(req.body);


    res
      .status(201)
      .json({
        ...response
      });
  });

  return route;
})(config, Api);
