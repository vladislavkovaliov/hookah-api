const config = require('../config');
const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');

module.exports = ((config, UserModel, TransactionModel) => {
  return {
    getPing: () => {
      return {
        message: 'ping',
      }
    },

    getConfig: () => {
      return {
        ...config,
      }
    },

    push: async (data) => {
      const {
        user: {
          imageUrl,
          email,
          name,
        }
      } = data;

      let user = await UserModel.findByEmail(email);

      if (!user) {
        user = await UserModel.create({
          email,
          name,
          imageUrl,
        });
      }

      const transaction = await TransactionModel.create({
        userId: user.id,
        amount: -2.5,
      });

      return transaction._doc;
    }
  };
})(config, UserModel, TransactionModel);
