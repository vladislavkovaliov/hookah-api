const events = require('./events');
const _ = require('lodash');

const UserModel = {
  find: jest.fn().mockResolvedValue(events),
  findOne: jest.fn().mockImplementation(event => {
    return Promise.resolve(events.find(e => e.name === event.name ));
  }),
  create: jest.fn().mockImplementation(event => {
    events.push(event);
    return Promise.resolve(event);
  }),
  exists: jest.fn().mockImplementation((event) => {
    return Promise.resolve(!!~events.findIndex(e => e.name === event.name ));
  }),
  findOneAndUpdate: jest.fn().mockImplementation((filter, newEvent) => {
    let event = null;

    events.map((e) => {
      if (e.name === filter.name) {
        event = e;
        return _.merge(e, newEvent);
      }

      return e;
    });

    return event;
  }),
};

module.exports = UserModel;