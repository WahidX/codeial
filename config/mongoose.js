const mongoose = require('mongoose');
const env = require('./environment');
console.log(process.env.CODEIAL_MONGODB_URI);
mongoose.connect(
  process.env.CODEIAL_MONGODB_URI || `mongodb://localhost/${env.db}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting mongodb'));

db.once('open', function () {
  console.log('Connected to mongoDB');
});

module.exports = db;
