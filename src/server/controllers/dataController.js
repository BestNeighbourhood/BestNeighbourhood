const mongoose = require('mongoose');
const dbConnect = require('../config/db_connect');

const connection = mongoose.createConnection(dbConnect.getDbConnectionString(), { auth: { authdb: 'admin' } });
// Logger
const logger = require('../config/logger');

const dataController = function () {
  /* Get Categories and datasets */
  const getCategories = function (req, res) {
    connection.db.collection('dsinfos', (err, collection) => {
      collection.aggregate([
        {
          $match: {
            category: { $ne: 'Other' },
          },
        },
        {
          $group: {
            _id: '$category',
            datasets: { $addToSet: '$title' },
          },
        },
      ]).toArray((err, docs) => res.status(200).json(docs));
    });
  };

  /* Get demographics for nbrhoods */
  const getDemo = function (req, res) {
    connection.db.collection('Toronto Population by Age (2014)', (err, collection) => {
      collection.find({}).toArray((err, docs) => res.json(docs));
    });
  };

  /* Get statistics for datasets  */
  const getStat = function (req, res) {
    connection.db.collection('SumDs', (err, collection) => {
      collection.aggregate(
        // Initial document match (uses index, if a suitable one is available)
        // { $match: {
        //     _id : "58f2aa09327603720911a9ca"
        // }},
        // Filter to 'homework' scores
        // { $match: {
        //     'neighbourhoods.title': 'New Toronto'
        // }},
        // // Expand the scores array into a stream of documents
        // { $unwind: '$neighbourhoods' },

        // // Sort in descending order
        // { $sort: {
        //     'neighbourhoods.count': -1
        // }}

      ).toArray((err, docs) => res.status(200).json(docs));
    });
  };


  return {
    getCategories,
    getStat,
    getDemo,
  };
};

module.exports = dataController;
