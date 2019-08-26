const balance = require('../balance.controller');

// jest.mock('../../models/balance.model');

describe('[balance.constoller.js]', () => {
  test('getAllBalances() - should return all balances', async () => {
    const result = await balance.getAllBalances();

    expect(result.length).not.toEqual(0);
  });

  test.skip('debit() - TDB', async () => {
    const result = await balance.debit({
      balanceId: 1,
      action: 'debit',
      amount: 1,
    });

    expect(result).toEqual(true);
  });

  test.skip('credit() - TDB', async () => {
    const result = await balance.credit({
      balanceId: 1,
      action: 'credit',
      amount: 1,
    });

    expect(result).toEqual(true);
  });
});