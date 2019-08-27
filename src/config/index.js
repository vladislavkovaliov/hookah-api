const { NODE_ENV } = process.env;

let config = null;

switch (NODE_ENV) {
  case 'production': {
    config = require('./dev');
    break;
  }
  case 'development': {
    config = require('./dev');
    break;
  }
  default: {
    config = require('./dev');
    break;
  }
}

module.exports = config;
