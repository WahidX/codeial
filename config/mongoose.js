const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/xspace_dev');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting mongodb'));

db.once('open', function(){
    console.log("Connected to mongoDB");
});

module.exports = db;