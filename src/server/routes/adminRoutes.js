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
var nbrBorders = require('../data/list.json');
var inside = require('point-in-polygon');

var router = function() {

    adminRouter.route('/loadTestDataSet').get(function (req, res) {
        dataService.selectDataFromDataSet( "ea23ff2c-cc42-4fea-8df3-1677b35538cf", "en-1", function (err, dataSetInfo) {
            console.log(dataSetInfo);
            res.send(dataSetInfo);
        });
    });

    // Load Datasets 
    adminRouter.route('/loadData').get(function (req, res) {
        
        dataService.getListOfCategories (
            function (err, categories) {

                // Drop existing collections first :
                Category.remove({}, function (err) {
                    logger.info("✔-x-- Categories dropped!");
                });

                DsInfo.remove({}, function (err) {
                    logger.info("✔-x-- DatasetInfo dropped!");
                });

                Category.create(categories, function(err, results) {
                    if (err) {
                        logger.info('X-- Error while adding categories: ' + err);
                    } else {
                        logger.info("✔-- Categories in db!");
                        logger.info("✔-- DataSet info [items] within categories in db!");

                        // Fetch data Sets
                        var cursor = Category.find().cursor();
                        cursor.on('data', function(doc) {

                            var dsIdsCount = doc.items.length;
                            for (var i = 0; i < dsIdsCount; i++) {
                                var dataSetId = doc.items[i].data_set_uuid;

                                dataService.getDataSetInfo(dataSetId, function (err, dsInfo) {

                                    if (err) {
                                        logger.warn('X-- Error occured while fetching dataset info "' + dataSetId + '" in a category "' + doc.title + '"');
                                        logger.warn('X-- ' + err);
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

                                    DsInfo.create(datasetInfo, function (err, results) {
                                        if (err) {
                                            logger.warn('X-- Error while adding DsInfo: ' + err);
                                            return;
                                        } else {
                                            dataService.selectDataFromDataSet(results.id , results.version, function (err, dataSetData) {
                                                if (err) {
                                                    logger.warn('X-- Error occured while fetching dataset "' + dataSetId + '" in a category "' + doc.title + '"');
                                                    logger.warn('X-- ' + err);
                                                    return;
                                                }
                                                var Ds = connection.model(collectionTitle, dataSetSchema);
                                                Ds.create(dataSetData, function(err, results) {
                                                    if (err) {
                                                        logger.warn('-X-- Error while adding datasets: ' + err);
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
                            logger.info("✔-- Done adding datasets in db!");
                            res.send('Done fetching the results');
                        });
                }
            }); 
        });
    });

    return adminRouter;
};

module.exports = router;
