const express = require('express');
const config = require('../config');

const Event = require('../controllers/events.controller');

module.exports = ((config, event) => {
  const route = express.Router();

  route.get('/', async (req, res, next) => {
    const response = await event.getAllEvents();

    if (response instanceof Error) {
      next(response);
      return;
    }

    res.json({
      data: response,
    });
  });

  route.post('/', async (req, res, next) => {
    const {
      name,
      startDate,
      endDate,
      attendants = [],
    } = req.body;
    const response = await event.createEvent({
      name,
      startDate,
      endDate,
      attendants,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .status(201)
      .json({ ...response });
  });

  route.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const response = await event.getEventById({
      id,
    });

    if (response instanceof Error) {
      next(response);
      return;
    }

    res
      .json({ ...response });
  });

  route.patch('/pushAttentands', async (req, res) => {
    const response = await event.pushAttendant('__event_name__', 'rick@gmail.com');

    res.json({
      ...response,
    });
  });

  return route;
})(config, Event);
