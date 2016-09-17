var express     = require('express');
var adminRouter = express.Router();
/* Postgre to connect to db */
var pg = require('pg');
var config = require('../config/db_config.js');

var router = function() {

  var replaceAll = function(target, search, replacement) {
      return target.replace(new RegExp(search, 'g'), replacement);    
  };

   var createColumnBuilder = function (json, primaryKey, containsNbrhood) {

         /* Get keys */
         var colNames =  Object.keys(json);
         var values   =  [];

         /* Get values */
         for(var i = 0; i < colNames.length; i++) {
              values[i] = json[colNames[i]];
         }

         var str = '';
         for (var i = 0; i < colNames.length; i++ ) {

              if (i != 0) {
                  str += ', \n';
              }

              str += colNames[i] + ' STRING';

              if (colNames[i] === primaryKey) {
                  str += ', \n';
                  str += 'PRIMARY KEY (' + colNames[i] + ')';
              }
         }

         if (!containsNbrhood) {
             str += ', nbrhood STRING';
         }

         return str;
      }

      var createQueryBuilder = function (tableName, options , json) {


         primaryKey = options.primaryKey;
         containsNbrhood = options.containsNbrhood;

          pg.connect(config, function(err, client, done) {
          // Closes communication with the database and exits.
          var finish = function () {
            done();
            process.exit();
          };

          if (err) {
            console.error('Failed to connect to cockroach', err);
            finish();
          } 

          var columns = createColumnBuilder(json, primaryKey, containsNbrhood);

          var str = 'CREATE TABLE ' + tableName + ' ( \n ' + columns + ' );';

          client.query(str, function (err, results) {
            if (err) {
              console.log(err);
              finish();
            } 
          });
        });
      }

  var insertIntoTable = function(tableName, json, neighbourhood) {
        pg.connect(config, function(err, client, done) {
        // Closes communication with the database and exits.
        var finish = function () {
          done();
          process.exit();
        };

        if (err) {
          console.error('Failed to connect to cockroach', err);
          finish();
        }

        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            var str = '';
            var j = 0; 

            Object.keys(obj).forEach(function (key) {

                if (j != 0) {
                    str += ', ';
                }

                var objStr = obj[key];
                if (objStr === "" || !obj[key]) {
                    str += "'undefined'";
                } else {
                    if (typeof(objStr) === 'string') {
                      objStr = replaceAll(objStr, "'", " ");
                    }
                    str +=  "'" + objStr + "'";
                }
                j++;
            });

          str += neighbourhood;

          client.query('INSERT into ' + tableName + ' VALUES(' + str + ')', function (err, results) {
                if (err) {
                  console.log(err);
                  finish();
                } 
            });
        }
    });
  }
  var insertQueryBuilder = function( tableName, json) {

      /* Specified long - lat format */
        // function getNeighbourhood(lon, lat , neighbourhood)

          pg.connect(config, function(err, client, done) {
          // Closes communication with the database and exits.
          var finish = function () {
            done();
            process.exit();
          };

          if (err) {
            console.error('Failed to connect to cockroach', err);
            finish();
          } 

          client.query('SELECT longitude, latitude from ' + tableName , function (err, results) {
            if (err) { /* In case there's neighbourhood field by default' */
              console.log(err);
              insertIntoTable(tableName, json, "");
            } else { /* need to add neighbourhood at the end*/

                var fs = require('fs');

                //Declare the file with an object that you want to match with a neighbourhood
                //Just change the file name and
                fs.readFile(filename, 'utf8', function (err, data) {
                    if (err) throw err; // we'll not consider error handling for now
                    var obj = JSON.parse(data);
                    for(j = 0; j < obj.length; j++){
                        var res = getNeighbourhood(obj[j].latitude, obj[j].longitude, function (neigbourhood) {
                        console.log(neigbourhood);
                        });
                    }
                });

                var getNeighbourhood = require('../../../polygon.js');
                getNeighbourhood (longlatFormat.lng, longlatFormat.lat, function (n) {
                insertIntoTable(tableName, json, n);
          });
            } 
          });
        });

}

  adminRouter.route('/CreateTables').get(function (req, res) {
        
        // function getNeighbourhood(lon, lat , neighbourhood)

      //  var cultHotspotPointOfInterest = require('../config/CulturalHotspotPointsofInterest.json');
       // createQueryBuilder('CulturalHotspotPoI', "object_id", false, cultHotspotPointOfInterest[0]);
      

        var HeritageDis = require('../config/Heritage Districts.json');
        createQueryBuilder('HeritageDistricts',  { primaryKey : "objectid", containsNbrhood : false}, HeritageDis[0]);
        insertQueryBuilder("HeritageDistricts",  HeritageDis);

        res.send('loaded');

  });

  return adminRouter;
};

module.exports = router;
