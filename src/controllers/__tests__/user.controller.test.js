const user = require('../user.controller');
// const mocks = require('../../models/__mocks__/users');

// jest.mock('../../models/user.model');

describe('[user.constoller.js]', () => {
  test('getAllUsers() - should not be empty', async () => {
    const result = await user.getAllUsers();
    console.log(result);
    expect(result.length).not.toEqual(0);
  });
});