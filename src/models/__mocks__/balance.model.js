const balances = require('./balances');

const BalanceModel = {
  find: jest.fn().mockResolvedValue(balances),
  findById: jest.fn().mockResolvedValue({ _doc: true  }),
  findByIdAndUpdate: jest.fn().mockResolvedValue({ _doc: true }),
};

module.exports = BalanceModel;