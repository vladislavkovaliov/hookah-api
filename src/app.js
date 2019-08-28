const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = process.env.NODE_ENV === 'production'
  ? YAML.load('./src/swagger.production.yaml')
  : YAML.load('./src/swagger.yaml');
mongoose.Promise = Promise;
const config = require('./config');

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

/**
 * Routers
 */
app.use('/api', require('./routes/api.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/balances', require('./routes/balance.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/events', require('./routes/event.route'));

app.use((err, req, res, next) => {
  res.json({
      ...err,
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || config.port, () => {
  console.log('start on', config.port);
});
