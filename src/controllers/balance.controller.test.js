const balance = require('./balance.controller');
const mocks = require('../models/__mocks__/balances');

jest.mock('../models/balance.model');

describe('[balance.constoller.js]', () => {
  test('getAllBalances() - TDB', async () => {
    const result = await balance.getAllBalances();

    expect(result).toEqual(mocks);
  });

  test('debit() - TDB', async () => {
    const result = await balance.debit({
      balanceId: 1,
      action: 'debit',
      amount: 1,
    });

    expect(result).toEqual(true);
  });

  test('credit() - TDB', async () => {
    const result = await balance.credit({
      balanceId: 1,
      action: 'credit',
      amount: 1,
    });

    expect(result).toEqual(true);
  });
});