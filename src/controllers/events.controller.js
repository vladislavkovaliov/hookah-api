const config = require('../config');
const EventModel = require('../models/event.model');
const UserModel = require('../models/user.model');


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

    createEvent: async function (event) {
      try {
        const isEventExists = await _eventExists(event);

        if(isEventExists) {
          return {
            message: 'Event already is in db.'
          };
        }

        const newEvent = await EventModel.create(
          event,
        );

        return {
          status: 201,
          event: newEvent,
        };
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
