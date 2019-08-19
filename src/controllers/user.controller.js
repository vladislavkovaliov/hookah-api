const UserModel = require('../models/user.model');
const config = require('../config');

module.exports = ((config, UserModel) => {
  return {
    getAllUsers: async () => {
      const users = await UserModel.find();

      return users.map(u => ({
        _id: u._id,
        email: u.email,
        createdAt: u.createdAt,
      }));
    },
  };
})(config, UserModel);
