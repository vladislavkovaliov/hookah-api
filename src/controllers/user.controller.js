const UserModel = require('../models/user.model');
const config = require('../config');
const mongoose = require('mongoose');
const existsByFilter = require('../utils/exists-by-filter.util');


module.exports = ((config, UserModel) => {
  return {
    getAllUsers: async () => {
      try {
        const users = await UserModel.find();

        return users.map(u => ({
          _id: u._id,
          email: u.email,
          createdAt: u.createdAt,
        }));
      } catch (e) {
        console.trace(e);
      }
    },

    createUser: async (user) => {
      try {
        const isUserExists = await existsByFilter(
          UserModel,
          {email: user.email,},
        );

        if (isUserExists) {
          return {
            code: 200,
            message: 'User already exists.'
          }
        }

        const result = await UserModel.create(user);

        return result._doc;
      } catch (e) {
        console.trace(e);
      }
    },

    removeUser: async (user) => {
      try {
        const objectId = mongoose.Types.ObjectId(user.id);
        const isUserExists = await existsByFilter(
          UserModel,
          { _id: objectId },
        );

        if (!isUserExists) {
          return {
            code: 404,
          };
        }

        const result = await UserModel.findOneAndDelete({
          _id: objectId,
        });

        // TODO: returns removed user
        return result._doc;
      } catch (e) {
        console.trace(e);
        return {
          code: 500,
          ...e,
        };
      }
    },

    updateUser: async (user) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        const isUserExists = await existsByFilter(
          UserModel,
          { _id },
        );

        if (!isUserExists) {
          return {
            code: 404,
          };
        }

        const filter = { _id, };
        const result = await UserModel.findOneAndUpdate(
          filter,
          user,
          { new: true },
        );

        return result._doc;
      } catch (e) {
        console.trace(e);
      }
    },

    getUserById: async (user) => {
      try {
        const _id = mongoose.Types.ObjectId(user.id);
        const isUserExists = await existsByFilter(
          UserModel,
          { _id },
        );

        if (!isUserExists) {
          return {
            code: 404,
          };
        }

        const result = await UserModel.findOne({
          _id,
        });

        return result._doc;
      } catch (e) {
        console.trace(e);
      }
    },
  };
})(config, UserModel);
