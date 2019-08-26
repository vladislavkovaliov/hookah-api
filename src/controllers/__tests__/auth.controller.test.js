const auth = require('../auth.controller');
const jwt = require('jsonwebtoken');
const user = require('../user.controller');
// jest.mock('../../config', () => ({
//   port: '.|.',
// }));
// jest.mock('../../models/user.model');

it('', () => {

});

describe('[auth.controller.js]', () => {
  test('login() - should return token', async () => {
    const newUser = {
      email: 'rick_login@gmail.com',
      password: 'rick',
      strategy: 'jwt',
    };
    await auth.register(newUser);
    const result = await auth.login(newUser);

    expect(result).toHaveProperty('token');
    await user.removeUser(newUser);
  });

  test('register() - should create and return user that is created', async () => {
    const newUser = {
      email: 'rick@gmail.com',
      password: 'rick',
    };
    const result = await auth.register(newUser);

    expect(result.user.email).toEqual(newUser.email);

    await user.removeUser(newUser);
  });

  test.skip('logout() - should remove token from user property tokens', async () => {
    const user = {
      email: 'rick@gmail.com',
      password: 'rick',
      strategy: 'jwt',
    };
    const { token } = await auth.login(user);
    const result = await auth.logout(token);

    expect(result).toEqual({});
  });

  test.skip('refresh() - i dont know why i am here :(', async () => {
    const token = '';
    const result = await auth.login(token);

    expect(result).toEqual({
      token,
    });
  });
});
