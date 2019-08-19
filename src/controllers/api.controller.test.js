const api = require('./api.controller');

jest.mock('../config', () => ({
  port: '.|.',
}));

describe('[api.controller.js]', () => {
  test('getPing() - TDB', () => {
    const result = api.getPing();

    expect(result).toEqual({
      message: 'ping',
    });
  });

  test('getConfig() - TDB', async () => {
    const result = await api.getConfig();

    expect(result).toEqual({
      port: '.|.',
    });
  });
});
