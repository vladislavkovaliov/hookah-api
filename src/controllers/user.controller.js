const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');
const config = require('../config');
const mongoose = require('mongoose');
const { NotFound } = require('../errors');

module.exports = ((config, UserModel, TransactionModel) => {
  return {
    getAllUsers: async () => {
      try {
        const users = await UserModel
          .find();
          // .populate('balance');
          // .populate('transactions');

        // const users = await UserModel.aggregate([
        //   {
        //     $lookup: {
        //       from: 'balances',
        //       localField: "_id",
        //       foreignField: "userId",
        //       as: "inventory_docs"
        //     },
        //   },
        // ]);

        return users.map(u => ({
          _id: u._id,
          email: u.email,
          name: u.name,
          balance: u.balance,
          imageUrl: u.imageUrl,
          transactions: u.transactions,
        }));
      } catch (e) {
        console.trace(e);
      }
    },

    createUser: async (user) => {
      try {
        const result = await UserModel.create(user);

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    removeUser: async (user) => {
      try {
        const objectId = mongoose.Types.ObjectId(user.id);
        const result = await UserModel.findOneAndDelete({
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

    updateUser: async (user) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        const filter = { _id, };
        const result = await UserModel.findOneAndUpdate(
          filter,
          user,
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

    getUserById: async (user) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        // const result = await UserModel.findOne({
        //   _id,
        // })
        //   .populate('balance');
        //
        const result = await UserModel.aggregate([
          {
            $match: {
              _id,//: mongoose.Types.ObjectId(user.id),
            },
          },
          {
            $lookup: {
              from: 'balances',
              localField: 'balance',
              foreignField: '_id',
              as: 'balance',
            },
          },
          {
            $unwind: {
              path: '$balance',
            },
          },
          {
            $lookup: {
              from: 'transactions',
              localField: '_id',
              foreignField: 'userId',
              as: 'transactions',
            },
          },
        ]);
        // console.(result);

        // const [result, transactions] = await Promise.all([
        //   UserModel.findOne({
        //     _id,
        //   }).populate('balance'),
        //   TransactionModel.find({
        //     userId: _id,
        //   }),
        // ]);
        // console.log(transactions);
        if (!result) {
          throw new NotFound();
        }

        return result[0];
      } catch (e) {
        console.trace(e);
        return e;
      }
    },
  };
})(config, UserModel, TransactionModel);
