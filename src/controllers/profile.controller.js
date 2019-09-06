const mongoose = require('mongoose');
const config = require('../config');
const ProfileModel = require('../models/profile.model');

module.exports = ((config, ProfileModel) => {
  return {
    getProfileById: async (profile) => {
      try {
        const filter = {
          _id: mongoose.Types.ObjectId(profile._id),
        };
        const result = await ProfileModel.findOne(
          filter
        );

        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },
  };
})(config, ProfileModel);
