const mongoose = require('mongoose');

const dbConnect = require('../config/db_connect');

const connection = mongoose.createConnection(dbConnect.getDbConnectionString(), { auth: { authdb: 'admin' } });

// List of datasets within category
const dsInfoSchema = new mongoose.Schema({
  category: { type: String, default: '' },
  title: { type: String, default: '' },
  version: { type: String, default: '' },
  data_set_uuid: String,
  id: String,
});

// List of categories (Transportation, education etc...)
const catSchema = new mongoose.Schema({
  title: String,
  description: String,
  items_count: Number,
  id: String,
  items: [dsInfoSchema],
});

const Category = connection.model('Category', catSchema);
const DsInfo = connection.model('DsInfo', dsInfoSchema);

module.exports = {
  Category,
  DsInfo,
};
