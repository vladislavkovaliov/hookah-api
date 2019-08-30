const config = require('../config');
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const jwt = require('jsonwebtoken');

module.exports = ((config, UserModel, SessionModel) => {
  return {
    /**
     *
     * @param {User} user
     * @returns {string}
     */
    login: async (user) => {
      const { email, password } = user;

      try {
        const user = await UserModel.findByCredentials(email, password);
        const token = jwt.sign(
          {
            _id: user._id,
            email,
          },
          'secret13',
          { expiresIn: 60 * 60 },
        );

        Promise.all([
          await SessionModel.create({
            userId: user._id,
            token,
          }),
          await UserModel.findOneAndUpdate(
            { email, password, },
            { tokens: [...user.tokens, token] }, // TODO: use $push
          ),
        ]);

        return {
          token,
        }
      }
      catch (e) {
        console.trace(e);
        return e;
      }
    },

    logout: async (token) => {
      const filter = { tokens: { $in: [token] } };
      const oldUser = await UserModel.findOne(filter);

      if (!oldUser) {
        return {};
      }

      // TODO: remove after middleware will be implemented
      await UserModel.findOneAndUpdate(
        filter,
        {
          tokens: oldUser.tokens.filter(t => t !== token),
        },
      );

      return {
        message: '.|.'
      }
    },
    /**
     * @param {User} user
     * @returns {Object}
     */
    register: async (user) => {
      const { email, password, name = '' } = user;
      // TODO: re-code to static method at model ?and use next()?
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
          name,
        });

        return {
          status: 201,
          user: {
            email: newUser.email,
            name: newUser.name,
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
})(config, UserModel, SessionModel);

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
