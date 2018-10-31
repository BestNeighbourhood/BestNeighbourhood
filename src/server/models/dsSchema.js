var mongoose = require('mongoose');

var dsSchema = new mongoose.Schema({ }, { strict: false });

var ds = dsSchema; // connection.model('DataSets', dsSchema);
module.exports = ds;