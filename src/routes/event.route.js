const express = require('express');
const config = require('../config');

const Event = require('../controllers/events.controller');

module.exports = ((config, event) => {
  const route = express.Router();

  route.post('/', async (req, res) => {
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

    res.status(201).json({ ...response });
  });

  route.patch('/pushAttentands', async (req, res) => {
    const response = await event.pushAttendant('__event_name__', 'rick@gmail.com');

    res.json({
      ...response,
    });
  });

  return route;
})(config, Event);
