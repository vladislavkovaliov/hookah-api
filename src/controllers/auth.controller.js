const config = require('../config');
const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');
const SessionModel = require('../models/session.model');
const jwt = require('jsonwebtoken');

module.exports = ((config, UserModel, SessionModel, ProfileModel) => {
  return {
    /**
     *
     * @param {User} user
     * @returns {string}
     */
    login: async (user) => {
      const { email, password } = user;

      try {
        const user = await ProfileModel.findByCredentials(email, password);
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
          await ProfileModel.findOneAndUpdate(
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
      const oldUser = await ProfileModel.findOne(filter);

      if (!oldUser) {
        return {};
      }

      // TODO: remove after middleware will be implemented
      await ProfileModel.findOneAndUpdate(
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
      const isAlreadyExists = await ProfileModel.exists({
        email,
      });

      if (isAlreadyExists) {
        return {
          message: 'User already is in db.'
        };
      }

      try {
        const newUser = await ProfileModel.create({
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

    // /**
    //  * @param {Object}
    //  */
    // refresh: () => {
    //   return {
    //     token,
    //   };
    // },
  };
})(config, UserModel, SessionModel, ProfileModel);

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
