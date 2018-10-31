var mongoose = require('mongoose');
var dbConnect = require('../config/db_connect');
var passportLocalMongoose = require('passport-local-mongoose');

var connection = mongoose.createConnection(dbConnect.getDbConnectionString(), {auth:{authdb:"admin"}});
 
// define the schema for our user model
var userSchema = mongoose.Schema({
    local : {
        username     : String,
        password     : String,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = connection.model('User', userSchema);