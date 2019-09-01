const express = require('express');
const config = require('../config');

const Attendant = require('../controllers/attendant.controller');

module.exports = ((config, attendant) => {
  const route = express.Router();

  route.get('/', async (req, res, next) => {
    const response = await attendant.getAll();

    res
      .json({
        data: response,
      });
  });

  route.get('/:id', async (req, res, next) => {});

  route.post('/', async (req, res, next) => {});

  route.put('/:id', async (req, res, next) => {});

  route.delete('/:id', async (req, res, next) => {});

  return route;
})(config, Attendant);
