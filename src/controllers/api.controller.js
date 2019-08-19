const config = require('../config');

module.exports = ((config) => {
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
  };
})(config);
