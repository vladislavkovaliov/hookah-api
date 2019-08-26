const UserModel = require('../models/user.model');
const config = require('../config');

module.exports = ((config, UserModel) => {
  const userExists = async (user) => {
    const { email } = user;
    const isUserExists = await UserModel.exists({
      email,
    });

    return isUserExists;
  };

  return {
    getAllUsers: async () => {
      const users = await UserModel.find();

      return users.map(u => ({
        _id: u._id,
        email: u.email,
        createdAt: u.createdAt,
      }));
    },

    removeUser: async (user) => {
      const isUserExists = await userExists(user);

      if (!isUserExists) {
        return;
      }

      await UserModel.findOneAndDelete({
        email: user.email,
      });
    },
  };
})(config, UserModel);
