const mongoose = require('mongoose');
const config = require('../config');
const TransactionModel = require('../models/transaction.model');
const { NotFound } = require('../errors');

module.exports = ((config, TransactionModel) => {
  return {
    getAllTransaction: async (filter) => {
      try {
        const result = await TransactionModel.find();

        return result;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    createTransaction: async (transaction) => {
      try {
        const result = await TransactionModel.create(transaction);

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
  };
})(config, TransactionModel);
