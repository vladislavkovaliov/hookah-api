const mongoose = require('mongoose');
const config = require('../config');
const TransactionModel = require('../models/transaction.model');
const BalanceModel = require('../models/balance.model');
const { NotFound } = require('../errors');

module.exports = ((config, TransactionModel, BalanceModel) => {
  const removeTransactionAndUpdateBalance = async (transaction) => {
    const objectId = mongoose.Types.ObjectId(transaction._id);
    const result = await TransactionModel.findOneAndRemove({
      _id: objectId
    });

    if (!result) {
      throw new NotFound();
    }

    const filter = {
      userId: mongoose.Types.ObjectId(result.userId),
    };
    const balance = await BalanceModel.findOne(filter);

    balance.amount += result.amount >= 0 ? -result.amount : result.amount;

    const newBalance = await BalanceModel.updateOne(
      filter,
      balance,
      { new: true }
    );

    return [result, newBalance]
  };

  const createTransactionAndUpdateBalance = async (transaction) => {
    const result = await TransactionModel.create(transaction);
    const filter = {
      userId: mongoose.Types.ObjectId(transaction.userId),
    };
    const balance = await BalanceModel.findOne(
      filter,
    );

    balance.amount += parseInt(transaction.amount, 10);

    const newBalance = await BalanceModel.updateOne(
      filter,
      balance,
      { new: true }
    );

    return [result, newBalance];
  };

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
        const [result] = await createTransactionAndUpdateBalance(transaction);

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
        // TODO: clarify with Vlad
        // const { _id } = transaction;
        // const objectId = mongoose.Types.ObjectId(_id);
        // const result = await TransactionModel.findOneAndUpdate(
        //   { _id: objectId, },
        //   transaction,
        //   { new: true },
        // );
        // if (!result) {
        //   throw new NotFound();
        // }

        const [removedTransaction] = await removeTransactionAndUpdateBalance(transaction);
        const [result] = await createTransactionAndUpdateBalance({
          ...transaction,
          userId: removedTransaction.userId,
        });

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    removeTransaction: async (transaction) => {
      try {
        const [result] = await removeTransactionAndUpdateBalance(transaction);
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
