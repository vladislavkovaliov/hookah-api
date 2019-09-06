const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
mongoose.Promise = Promise;
const config = require('./config');
const swaggerDefinition = {
  info: {
    title: 'Hookah App',
    version: '1.0.0',
    description: 'TBD',
  },
  host: process.env.NODE_ENV === 'production' ? 'hookah-api.herokuapp.com' : 'localhost:3000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis: ['src/docs/**/*.yaml'],
};
const swaggerSpec = swaggerJSDoc(options);
const passport = require('passport');
const session = require('cookie-session');
const app = express();

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false } )
  .then(() => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ })
  .catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
  });

/**
 * Middleware
 */
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Routers
 */
app.use('/api', require('./routes/api.route'));
app
  .use(session({
    maxAge: 24*60*60*1000,
    keys: ['secret'],
  }))
  .use('/api/auth', require('./routes/auth.route'));
app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  require('./routes/user.route'),
);
app.use('/api/balances', require('./routes/balance.route'));
app.use('/api/transaction', require('./routes/transaction.route'));

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.json({
      ...err,
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT || config.port, () => {
  console.log('start on', config.port);
});
