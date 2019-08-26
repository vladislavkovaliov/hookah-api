const mongoose = require('mongoose');
const shelljs = require('shelljs');
mongoose.Promise = Promise;

const config = require('../../config');

beforeAll(function (done) {
  console.log('beforeAll');
  return done();
});

beforeEach(function(done) {
  mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true} )
    .then(() => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ })
    .catch(err => {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
      // process.exit();
    });


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