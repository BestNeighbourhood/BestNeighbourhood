const mongoose = require('mongoose');

const dsSchema = new mongoose.Schema({ }, { strict: false });

const ds = dsSchema; // connection.model('DataSets', dsSchema);
module.exports = ds;
