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
  console.log('MONGO: ', `mongodb://localhost/${env.db}`);
});

module.exports = db;

const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://droidx:<password>@cluster0.dlecj.mongodb.net/<dbname>?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  client.close();
});
