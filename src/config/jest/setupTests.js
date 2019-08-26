const mongoose = require('mongoose');
const shelljs = require('shelljs');
mongoose.Promise = Promise;

const config = require('../../config');

beforeAll(function (done) {
  console.log('beforeAll');
  return done();
});

beforeEach(function(done) {
  if (mongoose.connection.readyState === 0) {
    mongoose
      .connect(config.MONGODB_URI, {
        server: {
          reconnectTries: Number.MAX_VALUE,
          reconnectInterval: 1000
        },
        useNewUrlParser: true
      } )
      .then(() => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ })
      .catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        // process.exit();
      });
    return done();
  }
  return done();
});

afterEach(function(done) {
  mongoose.disconnect();

  return done();
});

afterAll(function (done) {
  console.log('afterAll');
  return done();
});