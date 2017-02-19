var express     = require('express');
var adminRouter = express.Router();

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

var router = function() {

    adminRouter.route('/loadTestDataSet').get(function (req, res) {
        dataService.selectDataFromDataSet( "ea23ff2c-cc42-4fea-8df3-1677b35538cf", function (err, dataSetInfo) {
                console.log(dataSetInfo);
                res.send(dataSetInfo);
        });
    });

    // Load Datasets 
    adminRouter.route('/loadData').get(function (req, res) {
        
        dataService.getListOfCategories (
            function (err, categories) {

                // Drop existing collections first :
                // Category.remove({}, function (err) {
                //     console.log("✔-x-- Categories dropped!");
                // });

                // Category.create(categories, function(err, results) {
                    if (err) {
                        console.log('X-- Error while adding categories: ' + err);
                    } else {
                        console.log("✔-- Categories in db!");
                        console.log("✔-- DataSet info [items] within categories in db!");

                        // Fetch data Sets
                        var cursor = Category.find().cursor();
                        cursor.on('data', function(doc) {

                            var dsIdsCount = doc.items.length;
                            for (var i = 0; i < dsIdsCount; i++) {

                               var dataSetId = doc.items[i].data_set_uuid;                               
                               dataService.getDataSetInfo(dataSetId, function (err, dsInfo) {
                                   console.log(dsInfo['data_set_metas'][0]['title']);
                                   var collectionTitle = dsInfo['data_set_metas'][0]['title'];
                                   var collectionVersion = dsInfo['versions'][0]['identifier'];
                                   DsInfo.update({id: dataSetId}, {title:collectionTitle, version: collectionVersion} , {upsert:true}, function(err, doc){
                                       if (err) {
                                          console.log('-X-- Error while updating titles for DataSetsInfos: ' + err);
                                       }
                                  
                                    //    console.log("-✔-- New title added for DataSetInfos: '" . collectionTitle + "'");
                                   });

                                   var id = dataSetId;
                                //    dataService.selectDataFromDataSet(id , function (err, dataSetData) {

                                //        console.log("-->" + dataSetId + "<--");
                                //        var Ds = connection.model(collectionTitle, dataSetSchema);
                                //        Ds.create(dataSetData, function(err, results) {
                                //             if (err) {
                                //                 console.log('-X-- Error while adding datasets: ' + err);
                                //             } else {
                                //                 console.log("-✔-- Dataset '" + collectionTitle + "'in db!");
                                //                 // console.log(results);
                                //             }
                                //        });
                                //    });
                               }); 
                            }
                            console.log("=================================================================");
                        });
                        cursor.on('close', function() {
                            // Called when done
                        });
                        res.send(results);
                    }
                // }); 

                // res.send("done");
              //  res.send(catSchema);
        });
    });

    return adminRouter;
};

module.exports = router;
