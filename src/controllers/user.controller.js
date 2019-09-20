const UserModel = require('../models/user.model');
const BalanceModel = require('../models/balance.model');
const config = require('../config');
const mongoose = require('mongoose');
const { NotFound } = require('../errors');

module.exports = ((config, UserModel, BalanceModel) => {
  return {
    getAllUsers: async (filter) => {
      try {
        const users = await UserModel
          .aggregate([
            {
              $sort: { 'createAt': -1 },
            },
            ...filter,
            {
              $lookup: {
                from: 'balances',
                localField: '_id',
                foreignField: 'userId',
                as: 'balance',
              },
            },
            {
              $unwind: {
                path: '$balance',
              },
            }
          ]);

        return users
      } catch (e) {
        console.trace(e);
      }
    },

    createUser: async (user) => {
      try {
        const newUser = await UserModel.create(user);
        await BalanceModel.create({
          userId: mongoose.Types.ObjectId(newUser._id),
          amount: 0,
          message: '',
        });

        const result = await UserModel.aggregate([
          {
            $match: {
              _id: newUser._id,
            },
          },
          {
            $lookup: {
              from: 'balances',
              localField: '_id',
              foreignField: 'userId',
              as: 'balance',
            },
          },
          {
            $unwind: {
              path: '$balance',
            },
          },
        ]);

        if (!result) {
          throw new NotFound();
        }

        return result[0];
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

    getUserById: async (user,) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        const result = await UserModel.aggregate([
          {
            $match: {
              _id,
            },
          },
          {
            $lookup: {
              from: 'balances',
              localField: '_id',
              foreignField: 'userId',
              as: 'balance',
            },
          },
          {
            $unwind: {
              path: '$balance',
            },
          },
        ]);

        if (!result || result.length === 0) {
          throw new NotFound();
        }

        return result[0];
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    getUserByIdWithTransactions: async (user, pipeline) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        const result = await UserModel.aggregate([
          {
            $match: {
              _id,
            },
          },
          {
            $lookup: {
              from: 'balances',
              localField: '_id',
              foreignField: 'userId',
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
              pipeline: [
                {
                  $match: { userId: _id },
                },
                ...pipeline,
              ],
              as: 'transactions',
            },
          },
        ]);

        if (!result || result.length === 0) {
          throw new NotFound();
        }

        return result[0];
      } catch (e) {
        console.trace(e);
        return e;
      }
    },

    getCount: async () => {
      return await UserModel.count();
    }
  };
})(config, UserModel, BalanceModel);
