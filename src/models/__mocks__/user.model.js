const users = require('./users');

const UserModel = {
  find: jest.fn().mockResolvedValue(users)
};

module.exports = UserModel;