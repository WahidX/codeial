const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(
  process.env.CODEIAL_MONGODB_URI || `mongodb://localhost/${env.db}`
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting mongodb'));

db.once('open', function () {
  console.log('Connected to mongoDB');
  console.log('MONGO: ', `mongodb://localhost/${env.db}`);
});

module.exports = db;
