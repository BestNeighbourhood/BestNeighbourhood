var mongoose = require('mongoose');

var dbConnect = require('../config/db_connect');
var connection = mongoose.createConnection(dbConnect.getDbConnectionString(), {auth:{authdb:"admin"}});

// List of datasets within category
var dsInfoSchema = new mongoose.Schema({
    title : { type: String, default: "" },
    version : { type: String, default: "" },
    data_set_uuid : String,
    id    : String
});

// List of categories (Transportation, education etc...)
var catSchema = new mongoose.Schema({
    title : String,
    description : String,
    items_count : Number,
    id    : String,
    items : [dsInfoSchema]
});

var Category = connection.model('Category', catSchema);
var DsInfo = connection.model('DsInfo', dsInfoSchema);

module.exports = { 
    Category : Category,
    DsInfo   : DsInfo
};