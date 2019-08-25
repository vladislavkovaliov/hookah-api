const config = require('../config');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = ((config, UserModel) => {
  return {
    /**
     *
     * @param {User} user
     * @returns {string}
     */
    login: async (user) => {
      const { email, password } = user;

      try {
        const isExists = await UserModel.exists({
          email,
          password,
        });

        if (!isExists) {
          return {
            message: 'User is not in db.'
          };
        }

        const user = await UserModel.findOne({
          email,
          password,
        });

        const token = jwt.sign(
          { email, },
          'secret13',
          { expiresIn: 60 * 60 },
        );

        const isAlreadyLogin = ~Array
          .from(user.tokens)
          .findIndex(async (token) => {
            const decoded = await jwt.verify(token, 'secret13');

            return user.email === decoded.email;
          });

        if (isAlreadyLogin) {
          return {
            message: 'User already is login'
          };
        }

        await UserModel.findOneAndUpdate(
          {
            email,
            password,
          },
          { tokens: [...user.tokens, token] },
        );

        return {
          token,
        }
      }
      catch (e) {
        console.trace(e);
      }
    },

    logout: async (token) => {
      const query = { tokens: { $in: [token] } };
      const oldUser = await UserModel.findOne(query);

      if (!oldUser) {
        return {};
      }

      await UserModel.findOneAndUpdate(
        query,
        {
          tokens: oldUser.tokens.filter(t => t !== token),
        },
      );

      return {
        message: 'User did logout'
      }
    },
    /**
     * @param {User} user
     * @returns {Object}
     */
    register: async (user) => {
      const { email, password } = user;
      const isAlreadyExists = await UserModel.exists({
        email,
      });

      if (isAlreadyExists) {
        return {
          message: 'User already is in db.'
        };
      }

      try {
        const newUser = await UserModel.create({
          email,
          password,
        });

        return {
          status: 201,
          user: {
            email: newUser.email,
          },
        }
      } catch (e) {
        console.trace(e);
      }
    },

    /**
     * @param {Object}
     */
    refresh: () => {
      return {
        token,
      };
    },
  };
})(config, UserModel);

/**
 * @typedef {Object} User
 *
 * @property {string} email
 * @property {string} password
 * @property {string} strategy
 */

/**
 *
 */
