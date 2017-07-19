var mongoose = require('mongoose');
var dbConnect = require('../config/db_connect');
var connection = mongoose.createConnection(dbConnect.getDbConnectionString(), {auth:{authdb:"admin"}});
//Logger
var logger = require('../config/logger');

var optionsController = function() {
 
    /* Get Categories and datasets */
    var getCategories = function (req, res) {
        connection.db.collection('dsinfos', function (err, collection) {
            collection.aggregate([
                {   
                    $match : {
                        "category" : { $ne : "Other"}
                    }
                },
                {  
                    $group : {
                        _id : "$category",
                        datasets : { $addToSet : "$title"},
                    }
                }
            ]).toArray(function (err, docs) {
                return res.status(200).json(docs);
            });
        });
    }

    /* Get demographics for nbrhoods */
    var getDemo = function (req, res) {
        connection.db.collection('Toronto Population by Age (2014)', function (err, collection) {
             collection.find({}).toArray(function (err, docs) {
                return res.json(docs);
            });
        });
    }

    /* Get statistics for dataset : sample usage : getStat*/
    var getStat = function (req, res) {

        connection.db.collection('SumDs', function (err, collection) {
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

            ).toArray( function (err, docs) {
                return res.status(200).json(docs);
            });
        });
    }


     return {
       getCategories : getCategories,
       getStat       : getStat,
       getDemo : getDemo
  };
}

module.exports = optionsController;