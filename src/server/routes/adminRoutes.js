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

               colNames[i] = colNames[i].replace(/ /g,"_");

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
             str += ', \n neighbourhood STRING';
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

  function getNeighbourhood(lat, lon , neighbourhood) {
    var point=[lon,lat];
    var fs = require('fs');
    var nbrhList = require('../data/list.json');

    var obj = nbrhList;

    for(i=0;i<obj.length;i++){
        var polygon=[];

        for(x=0;x<obj[i].geometry.coordinates[0].length;x++) {
            polygon.push([]);
            polygon[polygon.length - 1].push(obj[i].geometry.coordinates[0][x][1]);
            polygon[polygon.length - 1].push(obj[i].geometry.coordinates[0][x][0]);
        }
        var inside = require('point-in-polygon');
        if(inside(point,polygon)) {
            var name = obj[i].area_name;
            name = name.substring(0,name.indexOf('('));
            // console.log("insert " + lon +  " and " + lat + " and " +name);
            neighbourhood(name);
        }
    }
 
}


  var insertIntoTable = function(tableName, json, containsNbrhood) {

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
            // console.log(json[i]);
            
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

          if(!containsNbrhood && json[i].longitude && json[i].latitude) {
                getNeighbourhood( json[i].longitude, json[i].latitude, function (n) { 
                  n = replaceAll(n, "'", " ");             
                  client.query('INSERT into ' + tableName + ' VALUES(' + str + ', ' +  "'" + n + "'" + ')', function (err, results) {
                      if (err) {
                        console.log(err);
                        finish();
                      } 
                  });
            }); //
          } else {
                client.query('INSERT into ' + tableName + ' VALUES(' + str + ')', function (err, results) {
                      if (err) {
                        console.log(err);
                        finish();
                      } 
                  });
          }
    }
    console.log('>>>>>>>>>>>>>>>> loaded data for ' + tableName);
    });
  }

  /// RENAME SERVICE ///

  var renameService = function(tableName, oldName, newName) {

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
          var str = 'ALTER TABLE ' + tableName + ' RENAME COLUMN ' + oldName + ' to ' + newName;
          client.query(str, function (err, results) {
            if (err) {
              console.log(err);
              finish();
            } 
          });
        });
  }

  /*

{"employees":[
    {"firstName":"John", "lastName":"Doe"},
    {"firstName":"Anna", "lastName":"Smith"},
    {"firstName":"Peter", "lastName":"Jones"}
]}

  */

 /// PUBLIC SAFETY /// 
   adminRouter.route('/loadPublicSafety').get(function (req, res) {
        var PoliceSafetyIndicators  = require('../config/PoliceSafetyIndicators.json');
        createQueryBuilder('PoliceSafetyIndicators',{ primaryKey : "num", containsNbrhood : true}, PoliceSafetyIndicators[0]);
        insertIntoTable('PoliceSafetyIndicators', PoliceSafetyIndicators , true);

        var Defibrillators  = require('../config/Defibrillators.json');
        createQueryBuilder('Defibrillators',{ primaryKey : "object_id", containsNbrhood : false}, Defibrillators[0]);
        insertIntoTable('Defibrillators', Defibrillators , false);


        res.send('loading...');

  });

/// Transportation  //
adminRouter.route('/loadTransportation').get(function (req, res) {

        var BicycleShops  = require('../config/BicycleShops.json');
        createQueryBuilder('BicycleShops',{ primaryKey : "objectid", containsNbrhood : false}, BicycleShops[0]);
        insertIntoTable('BicycleShops', BicycleShops , false);



        var greenParking = require('../config/GreenPParking.json');
        createQueryBuilder('greenParking',{ primaryKey : "id, address ", containsNbrhood : false}, greenParking[0]);
        // parking has lat and lng instead of latitude and longitute
        renameService('greenParking', 'lat', 'latitude');
        renameService('greenParking', 'lng', 'longitude');
        insertIntoTable('greenParking', greenParking, false);
        res.send('loading...');
});


/// RECREATION ///
adminRouter.route('/loadRecreation').get(function (req, res) {
        var placesOfWorship = require('../config/Places of Worship.json');
        createQueryBuilder('placesOfWorship',{ primaryKey : "object_id", containsNbrhood : true}, placesOfWorship[0]);
        insertIntoTable('placesOfWorship', placesOfWorship, true);

        var torontoAttractions = require('../config/Places of Interest and Toronto Attractions.json');
        createQueryBuilder('torontoAttractions',{ primaryKey : "object_id", containsNbrhood : false}, torontoAttractions[0]);
        insertIntoTable('torontoAttractions', torontoAttractions, false);

        var heritageDistricts = require('../config/Heritage Districts.json');
        createQueryBuilder('heritageDistricts',{ primaryKey : "objectid", containsNbrhood : false}, heritageDistricts[0]);
        insertIntoTable('heritageDistricts', heritageDistricts, false);

        var cultHotspotPointOfInterest = require('../config/CulturalHotspotPointsofInterest.json');
        createQueryBuilder('CulturalHotspotPoI',{ primaryKey : "object_id", containsNbrhood : false}, cultHotspotPointOfInterest[0]);
        insertIntoTable('CulturalHotspotPoI', cultHotspotPointOfInterest, false);

        var trail = require('../config/Trail.json');
        createQueryBuilder('trail',{ primaryKey : "scope_id, street_name", containsNbrhood : false}, trail[0]);
        insertIntoTable('trail', trail , false);

});

/// Education /// 
  adminRouter.route('/loadEducation').get(function (req, res) {

        var wellbeingYouthServices  = require('../config/Wellbeing Toronto Youth Services.json');
        createQueryBuilder('wellbeingYouthServices',{ primaryKey : "ObjectId", containsNbrhood : true}, wellbeingYouthServices[0]);
        insertIntoTable('wellbeingYouthServices', wellbeingYouthServices , true);

        var schools  = require('../config/School Locations All Types.json');
        createQueryBuilder('schools',{ primaryKey : "Gen_Use_Code, CNTL_ID", containsNbrhood : false}, schools[0]);
        insertIntoTable('schools', schools , false);
  });

/// OTHER /// 
  adminRouter.route('/loadOther').get(function (req, res) {

        var economicProfile  = require('../config/EconomicProfile.json');
        createQueryBuilder('economicProfile',{ primaryKey : "num", containsNbrhood : true}, economicProfile [0]);
        insertIntoTable('economicProfile', economicProfile , true);

        var WellbeingDemographics  = require('../config/WellbeingDemographics.json');
        createQueryBuilder('WellbeingDemographics',{ primaryKey : "num", containsNbrhood : true}, WellbeingDemographics[0]);
        insertIntoTable('WellbeingDemographics', WellbeingDemographics , true);

  });


/// Load HealthCare /// 

adminRouter.route('/loadHealthCare').get(function (req, res) {
        var ambulanceStations  = require('../config/Ambulance Station Locations.json');
        createQueryBuilder('ambulanceStations',{ primaryKey : "add_pt_id", containsNbrhood : false}, ambulanceStations[0]);
        insertIntoTable('ambulanceStations', ambulanceStations , false);

        var earlyYearsCentres  = require('../config/Ontario Early Years Centres (Toronto).json');
        createQueryBuilder('earlyYearsCentres',{ primaryKey : "street, phone", containsNbrhood : false}, earlyYearsCentres[0]);
        insertIntoTable('earlyYearsCentres', earlyYearsCentres , false);

         var childCareCentres  = require('../config/Licensed Child Care Centres.json');
        createQueryBuilder('childCareCentres',{ primaryKey : "LOC_id", containsNbrhood : false}, childCareCentres[0]);
        insertIntoTable('childCareCentres', childCareCentres , false);
});


  //used for testing, remove later
  adminRouter.route('/CreateTables').get(function (req, res) {
        var schools  = require('../config/School Locations All Types.json');
        createQueryBuilder('schools',{ primaryKey : "Gen_Use_Code, CNTL_ID", containsNbrhood : false}, schools[0]);
        insertIntoTable('schools', schools , false);
  });

  return adminRouter;
};

module.exports = router;
