const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');
mongoose.Promise = Promise;
const config = require('./config');

const app = express();

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true} )
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


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(config.port, () => {
  console.log('start on', config.port);
});

