var mongoose = require('mongoose');
mongoose.connect(process.env.PROD_MONGODB || 'mongodb://localhost/cally-bot');

var db = mongoose.connection;

module.exports = db;