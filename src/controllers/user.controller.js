const UserModel = require('../models/user.model');
const config = require('../config');
const mongoose = require('mongoose');
const { NotFound } = require('../errors');

module.exports = ((config, UserModel) => {
  return {
    getAllUsers: async () => {
      try {
        const users = await UserModel
          .find();

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

    getUserByIdWithTransactions: async (user) => {
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
              localField: '_id',
              foreignField: 'userId',
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
  };
})(config, UserModel);
