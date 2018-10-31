require('dotenv').config();

module.exports = {

  getDbConnectionString() {
    return `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:27017/${process.env.DB}`;
  },

};
