const { NODE_ENV } = process.env;

let config = null;

switch (NODE_ENV) {
  case 'development': {
    config = require('./dev');
  }
  default: {
    config = require('./dev');
  }
}

module.exports = config;
