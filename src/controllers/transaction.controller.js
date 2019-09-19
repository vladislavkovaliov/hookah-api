const mongoose = require('mongoose');
const config = require('../config');
const TransactionModel = require('../models/transaction.model');
const BalanceModel = require('../models/balance.model');
const { NotFound } = require('../errors');

module.exports = ((config, TransactionModel, BalanceModel) => {
  return {
    getAllTransaction: async (filter) => {
      try {
        const result = await TransactionModel.aggregate([
          {
            $sort: { 'date': -1 },
          },
          ...filter,
        ]);

        return result;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    createTransaction: async (transaction) => {
      try {
        const result = await TransactionModel.create(transaction);
        const filter = {
          userId: mongoose.Types.ObjectId(transaction.userId),
        };
        const balance = await BalanceModel.findOne(
          filter,
        );
        balance.amount += transaction.amount;
        await BalanceModel.updateOne(
          filter,
          balance,
          { new: true }
        );

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    getTransactionById: async (transaction) => {
      try {
        const { _id } = transaction;
        const objectId = mongoose.Types.ObjectId(_id);
        const result = await TransactionModel.findById({
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

    updateTransaction: async (transaction) => {
      try {
        const { _id } = transaction;
        const objectId = mongoose.Types.ObjectId(_id);
        const result = await TransactionModel.findOneAndUpdate(
          { _id: objectId, },
          transaction,
          { new: true },
        );

        if (!result) {
          throw new NotFound();
        }

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    removeTransaction: async (transaction) => {
      try {
        const objectId = mongoose.Types.ObjectId(transaction._id);
        const result = await TransactionModel.findOneAndRemove({
          _id: objectId
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

    getCount:async () => {
      return await TransactionModel.count();
    },
  };
})(config, TransactionModel, BalanceModel);
