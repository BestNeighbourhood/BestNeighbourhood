//Logger
var logger = require('../config/logger');
// DB 
var mongoose = require('mongoose');
var dbConnect = require('../config/db_connect');
var connection = mongoose.createConnection(dbConnect.getDbConnectionString(), {auth:{authdb:"admin"}});

// API providers
var dataService = require('../services/dataService')();

// DB Models / Schemas
var Category = require('../models/categoryModel').Category;
var DsInfo   = require('../models/categoryModel').DsInfo;
var SumDs = require('../models/categoryModel').SumDs;

var dataSetSchema  = require('../models/dsSchema'); // For schema-less docs

// Load borders 
var nbrBorders = require('../data/list');
var inside = require('point-in-polygon');
var jsts = require("jsts")

var adminController = function() {

    // === Properties/helpers  
    // ===+===+===+===+===+=== 

    // RTree will store neighbourhoods and their polygons
    var rTree      = new jsts.index.strtree.STRtree();
    var geoFactory = new jsts.geom.GeometryFactory();

    // To track async completion
    OnComplete = (function() {
        var count, countToDo;
        return function(options, callback) {
            if (!options) options = {};

            count = options.count || 0;
            countToDo = options.countToDo || 0;

            this.requestComplete = function(isComplete) {
                count++
                if (count == countToDo) callback(count);
            };
        };
    })();

    // Find collection by name
    function find (collec, query, callback) {
        connection.db.collection(collec, function (err, collection) {
            collection.find(query).toArray(callback);
        });
    }

    // === Controller Routes 
    // ===+===+===+===+===+=== 

    /* Create summary table */
    var processDb = function (req, res) {

        logger.info("==========================================================================");
        logger.info("=====================  Processing dataSets in db.. =======================");
        logger.info("==========================================================================");

        // Initialize R-tree with neighbourhoods
        for (var i = 0; i < nbrBorders.length; i++ ) {
            var nbrCoord = [];
            nbrBorders[i].geometry.coordinates[0].forEach(function(vertex) {
                nbrCoord.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
            });

            // Close polygon
            nbrCoord.push(nbrCoord[0]);
            
            var nbrPoly = [];
            nbrPoly.polygon = geoFactory.createPolygon(geoFactory.createLinearRing(nbrCoord));
            nbrPoly.area_name = nbrBorders[i].area_name;
            // insert boundaries (maxy, maxx, miny, minx) and all the coordinates + nbrhood names
            rTree.insert(nbrPoly.polygon.getEnvelopeInternal(), nbrPoly);
        }

        DsInfo.find({}).exec( function(err, info) {

            // First, summary table needs to be initialized
            logger.info('+-- Initializing sum table...')
            var sumData = [];            
            info.reduce(function(infoMap, item) {
                var data  = [];
                data["dataset"] = item.toObject().title;
                sumData.push(data);
            });

            connection.db.collection('SumDs', function (err, collection) {
                if (!err) { 
                    collection.drop();
                    logger.info("✔-- Dropped existing SumDs document!")
                }
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

                                    var onComplete = new OnComplete({countToDo : docs.length}, function (count) {
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
                                        SumDs.update( { dataset : collinfo.name }, { $push: update }, function (err, element) {
                                            var msg = "✔-- Found '" + nbrcount + "' neighbourhood values for dataset entries with row-count '" + docs.length + "' in ('" + collinfo.name + "')";

                                            if (nbrcount < docs.length) {
                                                logger.warn(msg);
                                            } else {
                                                logger.info(msg)
                                            }
                                        });
                                    });

                                    var nbrcount = 0;
                                    var nbrhoods = {};
                                    if ('neighbourhood' in docs[0] ) {              
                                        logger.info("✔-- Dataset '" + doc.title + "' already has 'Neighbourhood' property");
                                         docs.forEach(function (row) {
                                             nbrhoods[row.neighbourhood] = (nbrhoods[row.neighbourhood] || 0) + 1;
                                             nbrcount++;
                                             onComplete.requestComplete();
                                         });
                                    } else if (docs[0].geometry != undefined && docs[0].geometry.type == 'Polygon') { /** --- POLYGON --- */
                                        docs.forEach(function (row) { 
                                            var check = row.geometry;
                                            if (check) {
                                                var objCoordinates = [];
                                                row.geometry.coordinates[0].forEach(function(vertex) {
                                                    objCoordinates.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
                                                });
                                                
                                                // Close the polygon 
                                                objCoordinates.push(objCoordinates[0]);
                                                try {
                                                    var dsPoly = geoFactory.createPolygon(geoFactory.createLinearRing(objCoordinates));
                                                    // Find nodes that may potentially intersect a polygon
                                                    var polyNodes = rTree.query(dsPoly.getEnvelopeInternal());

                                                    polyNodes.array_.forEach(function(d) {
                                                        // verify that a dataset polygon intersects a neighbourhood
                                                        if(d.polygon.intersects(dsPoly)) {
                                                            nbrcount++;
                                                            var intersection = d.polygon.intersection(dsPoly);
                                                            nbrhoods[d.area_name] = (nbrhoods[d.area_name] || 0) + intersection.getArea();
                                                        }
                                                    });
                                                } catch (err) { // for some rows JSTS throws ambiguous error
                                                   //  logger.info(err);
                                                }
                                            }

                                            onComplete.requestComplete();
                                        });
                                    } else if (docs[0].geometry != undefined && docs[0].geometry.type == 'LineString') {  /** --- LINE STRING --- */
                                        docs.forEach(function (row) { 
                                            var check = row.geometry;
                                            if (check) {
                                                var objCoordinates = [];
                                                row.geometry.coordinates.forEach(function(vertex) {
                                                    objCoordinates.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
                                                });
                                                
                                                try {
                                                    var dsString = geoFactory.createLineString(objCoordinates);
                                                    // Find nodes that may potentially intersect a polygon
                                                    var polyNodes = rTree.query(dsString.getEnvelopeInternal());

                                                    polyNodes.array_.forEach(function(d) {
                                                        // verify that a dataset string intersects a neighbourhood
                                                        if(d.polygon.intersects(dsString)) {
                                                            nbrcount++;
                                                            var intersection = dsString.intersection(d.polygon);
                                                            nbrhoods[d.area_name] = (nbrhoods[d.area_name] || 0) + intersection.getLength();
                                                        }
                                                    });
                                                } catch (err) { // for some rows JSTS throws ambiguous error
                                                    logger.info(err);
                                                }
                                            }

                                            onComplete.requestComplete();
                                        });
                                    } else if ( (docs[0].lat != undefined && docs[0].lng != undefined) ||                   
                                                (docs[0].latitude != undefined && docs[0].longitude != undefined) ||
                                                (docs[0].geometry != undefined && docs[0].geometry.type == 'Point')) {   /** --- POINT --- */

                                        docs.forEach(function (row) {
                                            var check = true;

                                            var objCoordinates = [];
                                            // Different longitude & latitude representations
                                            if (docs[0].geometry != undefined && docs[0].geometry.type == 'Point') {
                                                check = row.geometry;
                                                if (check) { 
                                                    objCoordinates = row.geometry.coordinates;
                                                }
                                            } else if (docs[0].lat != undefined && docs[0].lng != undefined ) {
                                                objCoordinates = [ row.lng , row.lat ];
                                            } else if (docs[0].latitude != undefined && docs[0].longitude != undefined) {
                                                objCoordinates = [ row.longitude , row.latitude ];
                                            } 

                                            for (var i = 0; i < nbrBorders.length && check; i++) {
                                                if (inside(objCoordinates, nbrBorders[i].geometry.coordinates[0])) {
                                                    nbrcount++;
                                                    nbrhoods[nbrBorders[i].area_name] = (nbrhoods[nbrBorders[i].area_name] || 0) + 1;
                                                    break;
                                                }
                                            }
                                            onComplete.requestComplete();
                                        });

                                    } else {
                                        logger.error("X-- Could not recoginze location field for dataset  ('" + collinfo.name + "')");
                                    } 
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

                        // Fetch data Sets
                        var cursor = Category.find().cursor();
                        cursor.on('data', function(doc) {

                            // Fetch list of datasets in a category
                            dataService.getCategoryItems(doc.id, function (err, dsInfos) {

                                if (err) {
                                    logger.error('X-- Error occured while fetching datasets information for category "' + doc.title + '"');
                                    logger.error('X-- ' + err);
                                    return;
                                }
                                
                                for (var i = 0; i < dsInfos.length; i++) {

                                    dataService.getDataSetInfo(dsInfos[i].data_set_uuid, function (err, dsInfo) {
                                        if (err) {
                                            logger.error('X-- Error occured while fetching dataset info "' + dsInfos[i].data_set_uuid + '" in a category "' + doc.title + '"');
                                            logger.error('X-- ' + err);
                                            return;
                                        }
                                        
                                        var collectionTitle = dsInfo['data_set_metas'][0]['title'];
                                        var collectionVersion = (dsInfo['versions'][dsInfo['versions'].length - 1]['number_of_rows'] == 0) 
                                                                 ? dsInfo['versions'][0]['identifier']
                                                                 : dsInfo['versions'][dsInfo['versions'].length - 1]['identifier'];
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
                                                        logger.error('X-- Error occured while fetching dataset "' + results.id  + '" in a category "' + doc.title + '"');
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
                            
                        });
                        cursor.on('close', function() {
                            res.send('Check logs for progress information');
                        });
                }
            }); 
        });
    }

    return {
        loadData : loadData,    // Load data from data API service
        processDb : processDb   // Process database and generate summary table
    }
}


module.exports = adminController;