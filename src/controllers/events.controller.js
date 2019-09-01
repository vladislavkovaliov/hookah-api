const config = require('../config');
const EventModel = require('../models/event.model');
const UserModel = require('../models/user.model');
const mongoose = require('mongoose');
const { NotFound } = require('../errors');

module.exports = ((config, EventModel, UserModel) => {
  const _eventExists = async (event) => {
    const { name } = event;
    const isEventExists = await EventModel.exists({
      name,
    });

    return isEventExists;
  };

  return {
    getAllEvents: async () => {
      const events = await EventModel.find();

      return events;
    },

    getEventById: async (event) => {
      try {
        const _id = mongoose.Types.ObjectId(event.id);

        if (!(await EventModel.exists({ _id }))) {
          throw new NotFound();
        }

        const result = await EventModel.findOne({
          _id,
        });

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    createEvent: async function (event) {
      try {
        const result = await EventModel.create(
          event,
        );

        return result._doc;
      }
      catch (e) {
        console.trace(e);
      }
    },

    updateEvent: async (event) => {
      try {
        const { name } = event;
        const isEventExists = await _eventExists(event);

        if(!isEventExists) {
          return {
            message: 'Event is not in db.'
          };
        }

        const filter = { name, };
        const newEvent = await EventModel.findOneAndUpdate(
          filter,
          event,
          { new: true },
        );

        return {
          event: newEvent,
        };
      }
      catch (e) {
        console.trace(e);
      }
    },

    pushAttendant: async (eventName, attendant) => {
      try {
        const event = await EventModel
          .find()
          .where({ name: eventName });

        debugger;
      }
      catch (e) {
        console.trace(e);
      }
    },

    removeAttendant: async () => {},
  };
})(config, EventModel, UserModel);
