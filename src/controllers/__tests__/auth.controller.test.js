const auth = require('../auth.controller');
const jwt = require('jsonwebtoken');

jest.mock('../../config', () => ({
  port: '.|.',
}));
jest.mock('../../models/user.model');

describe('[auth.controller.js]', () => {
  test('login() - should return token', async () => {
    const user = {
      email: 'rick@gmail.com',
      password: 'rick',
      strategy: 'jwt',
    };
    const result = await auth.login(user);
    const token = jwt.sign(
      { email: user.email, },
      'secret13',
      { expiresIn: 60 * 60 },
    );

    expect(result).toEqual({
      token,
    });
  });

  test('register() - should create and return user that is created', async () => {
    const newUser = {
      email: 'rick@gmail.com',
      password: 'rick',
    };
    const result = await auth.register(newUser);

    expect(result).toEqual({
      status: 201,
      user: {
        email: newUser.email,
      },
    });
  });

  test('logout() - should remove token from user property tokens', async () => {
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
