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
var SumDs = require('../models/categoryModel').SumDs;

var dataSetSchema  = require('../models/dsSchema');

// Load borders 
var nbrBorders = require('../data/list');
var inside = require('point-in-polygon');

var adminController = function() {

    function find (collec, query, callback) {
        connection.db.collection(collec, function (err, collection) {
            collection.find(query).toArray(callback);
        });
    }

    /* Create summary table */
    var processDb = function (req, res) {

        logger.info("==========================================================================");
        logger.info("=====================  Processing dataSets in db.. =======================");
        logger.info("==========================================================================");

        DsInfo.find({}).exec( function(err, info) {

            // First, summary table needs to be initialized
            logger.info('+-- Initializing sum table...')
            var sumData = [];            
            info.reduce(function(infoMap, item) {
                var data  = [];
                data["dataset"] = item.toObject().title;
                sumData.push(data);
            });
            
            var SumDs = connection.model('SumDs', dataSetSchema, 'SumDs');
            SumDs.create(sumData, function(err, results) {
                logger.info("✔-- SumDs is initialized!");

                logger.info('+-- Processing coordinates & calculating neighbourhoods for each dataset...');
                var cursor = DsInfo.find().cursor();
                var count = 0;

                cursor.on('data', function(doc) {
                    count++;                
                    connection.db.listCollections({name: doc.title})
                        .next(function(err, collinfo) {
                            
                            if (err) {
                                logger.error('X-- Error occured while fetching info about collection "' +collinfo.name+ '" from db');
                                logger.error('X-- Error message : "' + err + '"');
                            }
                            if (collinfo) {
                                find(collinfo.name, {}, function (err, docs) {
                                    var nbrcount = 0;
                                    var nbrhoods = {};
                                    if ('neighbourhood' in docs[0] ) {
                                        logger.info("✔-- Dataset '" + doc.title + "' already has 'Neighbourhood' property");
                                         docs.forEach(function (row) {
                                             nbrhoods[row.neighbourhood] = (nbrhoods[row.neighbourhood] || 0) + 1;
                                         });
                                    } else if ( (docs[0].lat != undefined && docs[0].lng != undefined) || 
                                                (docs[0].latitude != undefined && docs[0].longitude != undefined) ||
                                                (docs[0].geometry != undefined && docs[0].geometry.type == 'Point')) {

                                        docs.forEach(function (row) {
                                            var check = true;

                                            // Different longitude & latitude representations
                                            if (docs[0].lat != undefined && docs[0].lng != undefined ) {
                                                var objCoordinates = [ row.lng , row.lat];
                                            } else if (docs[0].latitude != undefined && docs[0].longitude != undefined) {
                                                var objCoordinates = [ row.longitude , row.latitude];
                                            } else {
                                                check = row.geometry;
                                                if (check) {
                                                    var objCoordinates = row.geometry.coordinates;
                                                }
                                            }

                                            for (var i = 0; i < nbrBorders.length && check; i++) {
                                                if (inside(objCoordinates, nbrBorders[i].geometry.coordinates[0])) {
                                                    nbrcount++;
                                                    nbrhoods[nbrBorders[i].area_name] = (nbrhoods[nbrBorders[i].area_name] || 0) + 1;
                                                    break;
                                                }
                                            }
                                        });


                                    }  else if (docs[0].geometry != undefined && docs[0].geometry.type == 'Polygon') { // TODO : find if poly-in-poly

                                    }

                                    // Change into mongo-friendly format
                                    var query = [];
                                    var keys = Object.keys(nbrhoods);
                                    for (var i = 0; i < keys.length; i++) {
                                        query.push({
                                            count : nbrhoods[keys[i]],
                                            title : keys[i]
                                        });
                                    }

                                    var name = 'neighbourhoods';
                                    var update = {};
                                    update[name] = query;

                                    // For each dataset -> generate summary for each neighbourhood
                                    // e.g. 
                                    // dataset : "BikeStations"
                                    // neighbourhoods :
                                    //     [
                                    //        [0] : { title : "Annex", count : 7},
                                    //        [1] : { title : "New Toronto", count : 2}
                                    //     ]
                                    SumDs.update( { dataset : collinfo.name }, { $push: update}, function (err, element) {
                                        var msg = "✔-- For '" + nbrcount + "' out of '" + docs.length + "' dataset entries, found neighbourhoods ('" + collinfo.name + "')";

                                        if (nbrcount < docs.length) {
                                            logger.warn(msg);
                                        } else {
                                            logger.info(msg)
                                        }
                                    });
                            });
                        }
                    });
                });

                cursor.on('close', function() {
                    logger.info("+-- Total number of datasets : " + count);
                    res.send('Check logs for progress information');
                });
            });
        });
    }

    /* Fetch data from namaro.io api */
    var loadData = function (req, res) {
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
    }

    return {
        loadData : loadData,
        processDb : processDb
    }
}


module.exports = adminController;