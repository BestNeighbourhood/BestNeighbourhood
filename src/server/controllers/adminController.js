// Logger
const mongoose = require('mongoose');
const logger = require('../config/logger');
// DB
const dbConnect = require('../config/db_connect');

const connection = mongoose.createConnection(dbConnect.getDbConnectionString(), { auth: { authdb: 'admin' } });

// API providers
const dataService = require('../services/dataService')();

// DB Models / Schemas
const Category = require('../models/categoryModel').Category;
const DsInfo = require('../models/categoryModel').DsInfo;
const SumDs = require('../models/categoryModel').SumDs;

const dataSetSchema = require('../models/dsSchema'); // For schema-less docs

// Load borders
const nbrBorders = require('../data/list');
const jsts = require('jsts');

const adminController = function () {
  // === Properties/helpers
  // ===+===+===+===+===+===

  // RTree will store neighbourhoods and their polygons
  const rTree = new jsts.index.strtree.STRtree();
  const geoFactory = new jsts.geom.GeometryFactory();

  // To track async completion
  OnComplete = (function () {
    let count; let
      countToDo;
    return function (options, callback) {
      if (!options) options = {};

      count = options.count || 0;
      countToDo = options.countToDo || 0;

      this.requestComplete = function (isComplete) {
        count++;
        if (count == countToDo) callback(count, countToDo);
      };
    };
  }());

  // Find collection by name
  function find(collec, query, callback) {
    connection.db.collection(collec, (err, collection) => {
      collection.find(query).toArray(callback);
    });
  }

  // === Controller Routes
  // ===+===+===+===+===+===

  /* Create summary table */
  const processDb = function (req, res) {
    logger.info('==========================================================================');
    logger.info('=====================  Processing dataSets in db.. =======================');
    logger.info('==========================================================================');

    // Initialize R-tree with neighbourhoods
    for (let i = 0; i < nbrBorders.length; i++) {
      var nbrCoord = [];
      nbrBorders[i].geometry.coordinates[0].forEach((vertex) => {
        nbrCoord.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
      });

      // Close polygon
      nbrCoord.push(nbrCoord[0]);

      const nbrPoly = [];
      nbrPoly.polygon = geoFactory.createPolygon(geoFactory.createLinearRing(nbrCoord));
      nbrPoly.area_name = nbrBorders[i].area_name;
      // insert boundaries (maxy, maxx, miny, minx) and all the coordinates + nbrhood names
      rTree.insert(nbrPoly.polygon.getEnvelopeInternal(), nbrPoly);
    }

    logger.info('+-- Initializing sum table...');

    // Drop existing sum doc if exists
    connection.db.collection('SumDs', (err, collection) => {
      if (!err) {
        collection.drop();
        logger.info('✔-- Dropped existing SumDs document!');
      }
    });

    const SumDs = connection.model('SumDs', dataSetSchema, 'SumDs');

    logger.info('+-- Processing coordinates & calculating neighbourhoods for each dataset...');
    const cursor = DsInfo.find().cursor();

    // For each dataset in dsInfo
    cursor.on('data', (doc) => {
      // Retrieve dataset itself
      connection.db.listCollections({ name: doc.title }).next((err, collinfo) => {
        if (err) {
          logger.error(`X-- Error occured while fetching info about collection "${collinfo.name}" from db`);
          logger.error(`X-- Error message : "${err}"`);
        }
        if (collinfo) {
          find(collinfo.name, {}, (err, docs) => { // Retrieve dataset itself
            // tracking completion events
            const onComplete = new OnComplete({ countToDo: docs.length }, ((count, countToDo) => {
              // Change into mongo-friendly format
              const query = [];
              const keys = Object.keys(nbrhoods);
              for (let i = 0; i < keys.length; i++) {
                query.push({
                  count: nbrhoods[keys[i]],
                  title: keys[i],
                });
              }

              const update = {};
              update.neighbourhoods = query;

              // For each dataset -> generate summary for each neighbourhood
              // e.g.
              // dataset : "BikeStations"
              // neighbourhoods :
              //     [
              //        [0] : { title : "Annex", count : 7},
              //        [1] : { title : "New Toronto", count : 2}
              //     ]
              SumDs.update({ dataset: collinfo.name }, { $push: update }, { upsert: true }, (err, element) => {
                const msg = `✔-- Found '${nbrcount}' neighbourhood values for dataset entries with row-count '${countToDo}' in ('${collinfo.name}')`;

                if (nbrcount < docs.length) {
                  logger.warn(msg);
                } else {
                  logger.info(msg);
                }
              });
            }));

            // Total number of geo-neighbourhood intersections
            var nbrcount = 0;
            // Array stores number of intersections for each neighbourhood
            var nbrhoods = {};
            const geoType = (docs[0].geometry !== undefined) ? docs[0].geometry.type : 'Point';

            if ('neighbourhood' in docs[0]) {
              logger.info(`✔-- Dataset '${doc.title}' already has 'Neighbourhood' property`);
              docs.forEach((row) => {
                nbrhoods[row.neighbourhood] = (nbrhoods[row.neighbourhood] || 0) + 1;
                nbrcount++;
                onComplete.requestComplete();
              });
            } else if (docs[0].geometry != undefined && (geoType == 'Polygon' || geoType == 'LineString')) { /** --- POLYGON or LINESTRING --- */
              docs.forEach((row) => {
                const geometry = row.geometry;

                if (geometry) {
                  const objCoordinates = [];
                  let geoObject = [];

                  if (geoType == 'Polygon') {
                    geometry.coordinates[0].forEach((vertex) => {
                      objCoordinates.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
                    });

                    // Close the polygon
                    objCoordinates.push(objCoordinates[0]);
                    geoObject = geoFactory.createPolygon(geoFactory.createLinearRing(objCoordinates));
                  } else if (geoType == 'LineString') {
                    geometry.coordinates.forEach((vertex) => {
                      objCoordinates.push(new jsts.geom.Coordinate(vertex[0], vertex[1]));
                    });
                    geoObject = geoFactory.createLineString(objCoordinates);
                  }

                  // Find nodes that *may potentially intersect a polygon / linestring
                  const polyNodes = rTree.query(geoObject.getEnvelopeInternal());

                  polyNodes.array_.forEach((d) => {
                    // verify that a geo obj intersects a neighbourhood
                    if (d.polygon.intersects(geoObject)) {
                      const intersection = d.polygon.intersection(geoObject);
                      // use either area or length to determine how much geo object overlaps a neighbourhood
                      let geoUnit = 0;
                      if (geoType == 'Polygon') {
                        geoUnit = intersection.getArea();
                      } else if (geoType == 'LineString') {
                        geoUnit = intersection.getLength();
                      }

                      nbrhoods[d.area_name] = (nbrhoods[d.area_name] || 0) + geoUnit;
                      nbrcount++;
                    }
                  });
                }

                onComplete.requestComplete();
              });
            } else if ((docs[0].lat != undefined && docs[0].lng != undefined)
                                    || (docs[0].latitude != undefined && docs[0].longitude != undefined)
                                    || (docs[0].geometry != undefined && geoType == 'Point')) { /** --- POINT --- */
              docs.forEach((row) => {
                let objCoordinates = [];
                // Different longitude & latitude representations
                if (docs[0].geometry != undefined && geoType == 'Point') {
                  objCoordinates = row.geometry.coordinates;
                } else if (docs[0].lat != undefined && docs[0].lng != undefined) {
                  objCoordinates = [row.lng, row.lat];
                } else if (docs[0].latitude != undefined && docs[0].longitude != undefined) {
                  objCoordinates = [row.longitude, row.latitude];
                }

                const geoObject = geoFactory.createPoint(new jsts.geom.Coordinate(objCoordinates[0], objCoordinates[1]));
                const polyNodes = rTree.query(geoObject.getEnvelopeInternal());

                polyNodes.array_.forEach((d) => {
                  // verify that a geo obj intersects a neighbourhood
                  if (geoObject.intersects(d.polygon)) {
                    nbrhoods[d.area_name] = (nbrhoods[d.area_name] || 0) + 1;
                    nbrcount++;
                  }
                });

                onComplete.requestComplete();
              });
            } else {
              logger.error(`X-- Could not recoginze location field for dataset  ('${collinfo.name}')`);
            }
          });
        }
      });
    });

    cursor.on('close', () => {
      res.send('Check logs for progress information');
    });
  };

  /* Fetch data from namaro.io api */
  const loadData = function (req, res) {
    logger.info('=============================================================================');
    logger.info('===================== Loading Data from DataService.. =======================');
    logger.info('=============================================================================');
    dataService.getListOfCategories(
      (err, categories) => {
        if (err) {
          logger.error('X-- Error occured while fetching cateogory info');
          logger.error(`X-- ${err}`);
          return;
        }

        // Drop existing collections first :
        Category.remove({}, (err) => {
          logger.info('✔-x-- Categories dropped!');
        });

        DsInfo.remove({}, (err) => {
          logger.info('✔-x-- DatasetInfo dropped!');
        });

        // Create categories
        Category.create(categories, (err, results) => {
          if (err) {
            logger.info(`X-- Error while adding categories to db: ${err}`);
          } else {
            logger.info('✔-- Categories in db!');

            // Fetch data Sets
            const cursor = Category.find().cursor();
            cursor.on('data', (doc) => {
              // Fetch list of datasets in a category
              dataService.getCategoryItems(doc.id, (err, dsInfos) => {
                if (err) {
                  logger.error(`X-- Error occured while fetching datasets information for category "${doc.title}"`);
                  logger.error(`X-- ${err}`);
                  return;
                }

                for (var i = 0; i < dsInfos.length; i++) {
                  dataService.getDataSetInfo(dsInfos[i].data_set_uuid, (err, dsInfo) => {
                    if (err) {
                      logger.error(`X-- Error occured while fetching dataset info "${dsInfos[i].data_set_uuid}" in a category "${doc.title}"`);
                      logger.error(`X-- ${err}`);
                      return;
                    }

                    const collectionTitle = dsInfo.data_set_metas[0].title;
                    const collectionVersion = (dsInfo.versions[dsInfo.versions.length - 1].number_of_rows == 0)
                      ? dsInfo.versions[0].identifier
                      : dsInfo.versions[dsInfo.versions.length - 1].identifier;
                    const category = doc.title;
                    const datasetInfo = {
                      id: dsInfo.id,
                      title: collectionTitle,
                      version: collectionVersion,
                      category,
                    };

                    // DsInfo store information about particular dataset (title, version, category it belongs to)
                    DsInfo.create(datasetInfo, (err, results) => {
                      if (err) {
                        logger.error(`X-- Error while adding DsInfo to db: ${err}`);
                        return;
                      }
                      // Request dataset itself
                      dataService.selectDataFromDataSet(results.id, results.version, (err, dataSetData) => {
                        if (err) {
                          logger.error(`X-- Error occured while fetching dataset "${results.id}" in a category "${doc.title}"`);
                          logger.error(`X-- ${err}`);
                          return;
                        }
                        // DatasetTitle is the name of a table
                        let Ds = connection.model(collectionTitle, dataSetSchema, collectionTitle);
                        Ds.create(dataSetData, (err, results) => {
                          if (err) {
                            logger.error(`-X-- Error while adding datasets to db: ${  err}`);
                          } else {
                            logger.info(`-✔-- Dataset '${  collectionTitle  }'in db!`);
                          }
                        });
                      });
                    });
                  });
                }
              });
            });
            cursor.on('close', () => {
              res.send('Check logs for progress information');
            });
          }
        });
      },
    );
  };

  return {
    loadData, // Load data from data API service
    processDb, // Process database and generate summary table
  };
};


module.exports = adminController;
