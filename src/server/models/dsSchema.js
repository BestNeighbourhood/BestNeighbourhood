var mongoose = require('mongoose');

var dbConnect = require('../config/db_connect');

var dsSchema = new mongoose.Schema({
    
}, { strict: false });

var ds = dsSchema; // connection.model('DataSets', dsSchema);
module.exports = ds;