const BalanceModel = require('../models/balance.model');
const config = require('../config');
const mongoose = require('mongoose');
const { NotFound } = require('../errors');

module.exports = ((config, BalanceModel) => {
  return {
    getAllBalances: async () => {
      const balances = await BalanceModel.find();

      return balances;
    },

    getBalanceById: async (balance) => {
      try {
        const _id = mongoose.Types.ObjectId(balance.id);
        const result = await BalanceModel.findOne({
          _id,
        });

        if (!result) {
          throw new NotFound();
        }

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    createBalance: async (balance) => {
      const { userId, amount, message } = balance;

      try {
        const balance = await BalanceModel.create({
          userId: mongoose.Types.ObjectId(userId),
          amount,
          message,
        });

        return balance._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    updateBalance: async (balance) => {
      const { userId, amount, message } = balance;
      try {
        const filter = {
          _id: mongoose.Types.ObjectId(userId),
          amount,
          message,
        };
        const result = await BalanceModel.findOneAndUpdate(
          filter,
          balance,
          { new: true },
        );

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    removeBalance: async (balance) => {
      try {
        const objectId = mongoose.Types.ObjectId(balance.id);
        const result = await BalanceModel.findOneAndDelete({
          _id: objectId,
        });

        if (!result) {
          throw new NotFound();
        }

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    /**
     * @param {Options} opts
     * @returns {Balance}
     */
    debit: async (opts) => {
      const filter = {
        _id: opts.balanceId,
      };
      const oldBalance = await BalanceModel.findById(filter);
      const update = {
        amount: oldBalance.amount - opts.amount,
      };

      const balance = await BalanceModel.findByIdAndUpdate(
        filter,
        update,
        { new: true },
      );

      return balance._doc;
    },
    /**
     * @param {Options} opts
     * @returns {Balance}
     */
    credit: async (opts) => {
      const filter = {
        _id: opts.balanceId,
      };
      const oldBalance = await BalanceModel.findById(filter);
      const update = {
        amount: oldBalance.amount + opts.amount,
      };

      const balance = await BalanceModel.findByIdAndUpdate(
        filter,
        update,
        { new: true },
      );

      return balance._doc;
    },
  };
})(config, BalanceModel);

/**
 * @typedef {Object} Options
 *
 * @property {string} balanceId
 * @property {string} action
 * @property {(number|string)}
 */

/**
 * @typedef {Object} Balance
 *
 * @property _id string
 * @property {string} email
 * @property {(number|string)} amount
 * @property {string} message
 * @property {string} createdAt
 * @property {string} updatedAt
 */

