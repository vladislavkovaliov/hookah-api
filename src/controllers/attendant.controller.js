const config = require('../config');
const AttendantModel = require('../models/attendant.model');

module.exports = ((config, AttendantModel) => {
  return {
    create: async (attendant) => {
      try {
        const { userId } = attendant;
        const result = await AttendantModel.create();


        return result._doc;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },
    getAll: async () => {
      try {
        const result = await AttendantModel
          .find()
          .populate('user');

        debugger;
      } catch (e) {
        console.trace(e);
        return e;
      }
    },
    update: async () => {},
    remove: async () => {},
    getById: async () => {},
  };
})(config, AttendantModel);
