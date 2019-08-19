const balance = require('./balance.controller');
const mocks = require('../models/__mocks__/balances');

jest.mock('../models/balance.model');

describe('[balance.constoller.js]', () => {
  test('getAllBalances() - should return all balances', async () => {
    const result = await balance.getAllBalances();

    expect(result.length).not.toEqual(0);
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