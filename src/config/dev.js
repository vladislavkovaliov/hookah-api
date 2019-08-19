module.exports = {
  port: 3000 || process.env.PORT,
  MONGODB_URI: 'mongodb://localhost:27017/<database>' || process.env.MONGODB_URI,
};

