const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const dbConnect = require('../config/db_connect');

const connection = mongoose.createConnection(dbConnect.getDbConnectionString(), { auth: { authdb: 'admin' } });

// define the schema for our user model
const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = connection.model('User', userSchema);
