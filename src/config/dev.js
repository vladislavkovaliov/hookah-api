module.exports = {
  port: 3000 || process.env.PORT,
  MONGODB_URI: 'mongodb://hookan:hookan!1@ds213538.mlab.com:13538/hookan' || process.env.MONGODB_URI,
  REDIRECT_URL: 'https://hookah-client.herokuapp.com/home' || process.env.REDIRECT_URL,
};
