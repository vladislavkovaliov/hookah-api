const users = require('./users');
const _ = require('lodash');

const UserModel = {
  find: jest.fn().mockResolvedValue(users),
  findOne: jest.fn().mockImplementation(user => {
    return Promise.resolve(users.find(u => u.email === user.email && u.password === user.password ));
  }),
  create: jest.fn().mockImplementation(user => {
    users.push(user);
    return Promise.resolve(user);
  }),
  exists: jest.fn().mockImplementation((user) => {
    return Promise.resolve(!!~users.findIndex(u => u.email === user.email && u.password === user.password ));
  }),
  findOneAndUpdate: jest.fn().mockImplementation((filter, newUser) => {
    let user = null;

    users.map((usr) => {
      if (usr.email === filter.email) {
        user = usr;
        return _.merge(usr, newUser);
      }

      return usr;
    });

    return user;
  }),
};

module.exports = UserModel;