var express     = require('express');
var adminRouter = express.Router();

//Logger
var logger = require('../config/logger');
// DB 
var mongoose = require('mongoose');
var dbConnect = require('../config/db_connect');
var connection = mongoose.createConnection(dbConnect.getDbConnectionString(), {auth:{authdb:"admin"}});
// API provider
var dataService = require('../services/dataService')();
// DB Models / Schemas
var Category = require('../models/categoryModel').Category;
var DsInfo   = require('../models/categoryModel').DsInfo;
var dataSetSchema  = require('../models/dsSchema');

// Load borders 
var nbrBorders = require('../data/list');
var inside = require('point-in-polygon');

function find (collec, query, callback) {
    connection.db.collection(collec, function (err, collection) {
        collection.find(query).toArray(callback);
    });
}

function findNeighbourhood(dataset, name){
    var count = 0;;
    dataset.forEach(function (row) {
        for (var i = 0; i < nbrBorders.length && row.geometry; i++) {
            var objCoordinates = row.geometry.coordinates;
            if (inside(objCoordinates, nbrBorders[i].geometry.coordinates[0])) {
                count++;
                break;
            }
        }
    });

    var msg = "✔-- Found '" + count + "' out of '" + dataset.length + "' neighbourhoods for dataset '" + name + "'";
    if (count < dataset.length) {
        logger.warn(msg);
    } else {
        logger.info(msg)
    }
}  

var router = function() {

    /** This function goes through datasets and assigns neighbourhood based on geometry values */
    adminRouter.route('/process_db').get(function (req, res) {

        logger.info("==========================================================================");
        logger.info("=====================  Processing dataSets in db.. =======================");
        logger.info("==========================================================================");
        logger.info('+-- Processing coordinates & calculating neighbourhoods for each dataset...');
        var cursor = DsInfo.find().cursor();
        var count = 0;
        var countProcessed = 0;

        cursor.on('data', function(doc) {
            count++;
       
            // Check if collection is indeed in db (some may be missing due to 502s from namaro)
            connection.db.listCollections({name: doc.title})
                .next(function(err, collinfo) {

                    if (err) {
                        logger.error('X-- Error occured while fetching info about collection "' +collinfo.name+ '" from db');
                        logger.error('X-- Error message : "' + err + '"');
                    }

                    if (collinfo) {
                        countProcessed++;

                        find(collinfo.name, {}, function (err, docs) {
                            if ('neighbourhood' in docs[0] ) {
                                logger.info("✔-- Dataset '" + doc.title + '" already has neighbourhood property');
                            } else if (docs[0].geometry != undefined ) {
                                if (docs[0].geometry.type == 'Point' ) {
                                    findNeighbourhood(docs, collinfo.name);
                                }
                            }
                        });
                    }
            });
        });
        cursor.on('close', function() {
            logger.info("+-- Total number of datasets : " + count);
            logger.info("== Total number of processed items : " + countProcessed);
            res.send('Check logs for progress information');
        });

        //console.log(nbrBorders[0].geometry.coordinates);
    });

    // Test route (to determine if communication with namaro is working)
    adminRouter.route('/loadTestDataSet').get(function (req, res) {
        dataService.selectDataFromDataSet( "ea23ff2c-cc42-4fea-8df3-1677b35538cf", "en-1", function (err, dataSetInfo) {
            console.log(dataSetInfo);
            res.send(dataSetInfo);
        });
    });

    // Load Categories & Datasets 
    adminRouter.route('/loadData').get(function (req, res) {

        logger.info("=============================================================================");
        logger.info("===================== Loading Data from DataService.. =======================");
        logger.info("=============================================================================");
        dataService.getListOfCategories (
            function (err, categories) {

                if (err) {
                    logger.error('X-- Error occured while fetching cateogory info');
                    logger.error('X-- ' + err);
                    return;
                }

                // Drop existing collections first :
                Category.remove({}, function (err) {
                    logger.info("✔-x-- Categories dropped!");
                });

                DsInfo.remove({}, function (err) {
                    logger.info("✔-x-- DatasetInfo dropped!");
                });

                // Create categories
                Category.create(categories, function(err, results) {
                    if (err) {
                        logger.info('X-- Error while adding categories to db: ' + err);
                    } else {
                        logger.info("✔-- Categories in db!");
                        logger.info("✔-- DataSet info [items] within categories in db!");

                        // Fetch data Sets
                        var cursor = Category.find().cursor();
                        cursor.on('data', function(doc) {

                            var dsIdsCount = doc.items.length;
                            // For each dataset in a category
                            for (var i = 0; i < dsIdsCount; i++) {
                                var dataSetId = doc.items[i].data_set_uuid;

                                // Dataset info returns dataset title and ds version that can be used
                                dataService.getDataSetInfo(dataSetId, function (err, dsInfo) {

                                    if (err) {
                                        logger.error('X-- Error occured while fetching dataset info "' + dataSetId + '" in a category "' + doc.title + '"');
                                        logger.error('X-- ' + err);
                                        return;
                                    }
                                    
                                    var collectionTitle = dsInfo['data_set_metas'][0]['title'];
                                    var collectionVersion = dsInfo['versions'][0]['identifier'];
                                    var category = doc.title;
                                    var datasetInfo = {
                                        id : dsInfo.id,
                                        title : collectionTitle,
                                        version : collectionVersion,
                                        category : category
                                    };

                                    // DsInfo store information about particular dataset (title, version, category it belongs to)
                                    DsInfo.create(datasetInfo, function (err, results) {
                                        if (err) {
                                            logger.error('X-- Error while adding DsInfo to db: ' + err);
                                            return;
                                        } else {
                                            // Request dataset itself
                                            dataService.selectDataFromDataSet(results.id , results.version, function (err, dataSetData) {
                                                if (err) {
                                                    logger.error('X-- Error occured while fetching dataset "' + dataSetId + '" in a category "' + doc.title + '"');
                                                    logger.error('X-- ' + err);
                                                    return;
                                                }
                                                // DatasetTitle is the name of a table
                                                var Ds = connection.model(collectionTitle, dataSetSchema, collectionTitle);
                                                Ds.create(dataSetData, function(err, results) {
                                                    if (err) {
                                                        logger.error('-X-- Error while adding datasets to db: ' + err);
                                                    } else {
                                                        logger.info("-✔-- Dataset '" + collectionTitle + "'in db!");
                                                    } 
                                                });
                                            });
                                         }
                                    });
                                }); 
                            }
                        });
                        cursor.on('close', function() {
                            res.send('Check logs for progress information');
                        });
                }
            }); 
        });
    });

    return adminRouter;
};

module.exports = router;
