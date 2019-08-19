const user = require('./user.controller');
const mocks = require('../models/__mocks__/users');

jest.mock('../models/user.model');

describe('[user.constoller.js]', () => {
  test('getAllUsers() - TDB', async () => {
    const result = await user.getAllUsers();

    expect(result).toEqual(mocks);
  });
});