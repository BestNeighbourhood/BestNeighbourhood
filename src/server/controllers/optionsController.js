    /* 
     "neighbourhood": "Agincourt South-Malvern West",
    "num": 128,
    "assaults": 108,
    "sexual_assaults": 20,
    "break_enters": 73,
    "robberies": 24,
    "vehicle_thefts": 32,
    "thefts": 19,
    "murders": 0,
    "arsons": 0,
    "fire_fire_alarms": "168",
    "fire_vehicle_incidents": 158,
    "hazardous_incidents": 70,
    "fire_medical_calls": "316"
    
    */
/*

  return adminRouter;

| ambulancestations      | + +
| bicycleshops           | +
| childcarecentres       | +
| culturalhotspotpoi     | +
| defibrillators         | +
| earlyyearscentres      | +
| economicprofile        | +
| greenparking           | +
| heritagedistricts      | +
| placesofworship        | +
| policesafetyindicators | +
| schools                | +
| torontoattractions     | +
| trail                  | +
| wellbeingdemographics  | + 
| wellbeingyouthservices | +

 */

var pg = require('pg');
var config = require('../config/db_config.js');

/* 
"ems_name": "Station 29",
    "ems_addres": "4560 SHEPPARD AVE E"

*/


/*
   "local_employment": "18,329.00",
    "businesses": "1,378.00",
    "debt_risk_score": 756,
    "child_care_spaces": 135,

*/


// category - title
var optionsController = function() {
 


var TablesOptions = [
    { 
        category: 'Health', tables: [
            {tableName : 'ambulancestations',title : 'Ambulance Stations' , fields  : 'ems_name, ems_addres'},
            {tableName : 'childcarecentres', title : 'Child Care Centres', fields   : 'LOC_NAME'}, 
            {tableName : 'defibrillators'  , title : 'Defibrillators',  fields :  'facility_name, address'},
            {tableName : 'earlyyearscentres', title : 'Early Year Centres', fields  : 'name'}
    ]},
    {
        category: 'Education', tables : [
            {tableName : 'schools', title : 'Schools',  fields : 'name'},
            {tableName : 'wellbeingyouthservices', title : 'Youth Services', fields : 'Website, Agency_name'},
        ]
    },
    {
        category: 'Recreation', tables : [
            {tableName : 'placesOfWorship',     title : 'Places of Worship', fields : 'faith'}, 
            {tableName : 'torontoattractions' , title : 'Attractions',     fields : 'title'}, 
            {tableName : 'heritagedistricts'  , title : 'Heritage Districts',  fields : 'details, address'},
            {tableName : 'culturalhotspotpoi' , title : 'Cultural Spots',  fields : 'pnt_of_interest'}, 
            {tableName : 'trail' , title : 'Trails',  fields : 'trail_name, street_name'}
        ]
    },
    {
        category: 'Transportation', tables : [
            {tableName : 'bicycleshops', title : 'Bicycle Shops',  fields : 'address, name'},
            {tableName : 'greenParking', title : 'Green Parking', fields : 'address, rate'}
        ]
    },
    {
        category: 'Other', tables : [
            {tableName : 'economicProfile', title : 'Economic Profile',  fields : 'local_employment, businesses, debt_risk_score, child_care_spaces'}, 
            {tableName : 'WellbeingDemographics', title : 'Demographics',  fields : 'total_population'}
        ]
    }, 
    {
        category: 'Safety', tables : [
            {tableName : 'policesafetyindicators', title : 'Safety',  fields : ''}
        ]
    }
];

    /* Get Categories and Subcategories  [category , tables [ title ]]  */
    var getCategories = function (req, res) {
         res.json(TablesOptions);
    }


    /* slider range 0...100  : getTop?nbrhoods= &importance= {category & rating from 0 to 1000}*/
    var getTopNeighbourhood = function (req, res) {


        var sortedNbrhoods = [];
        var nbrhoods = req.query.nbrhoods;

         for (var i = 0; i < TablesOptions.length; i++) {
             console.log(">> Going thoruhg categories");
             for (var k = 0; k < importance[i].length; k++) {

                 console.log(">>>> Going thru selected categories");
                if (TablesOptions[i].category === importance[k].category) {
                     console.log("= >>>> Found the Category selected");
                    for( var j =0; j < TablesOptions[i].tables.length; j++) {
                         console.log("= >>>> Go throuh tables in that category");
                        
                        var table = TablesOptions[i].tables[j];

                        /* Go thru each neighbourhood   policesafetyindicators*/ 
                    
                        for ( nbr  in nbrhoods) {  
                              var negative = (table.tableName === 'policesafetyindicators') ? -1 : 1;
                                                       client.query('SELECT count(*) FROM ' + table +' WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                                 if (err) {
                                        console.log(err);
                                 } else {
                                     
                                     //   isNegative* importance
                                     response.push('Number of Youth Services /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                                      // defibrillators               
                             } });
                    }
                }
             }
         }
    }
    }

    /* Get statistics for neighbourhood : sample usage : getStat?nbrhood=""*/
    var getStat = function (req, res) {
        var nbrhood = req.query.nbrhood;
        
        if(!nbrhood) {
            res.send(401);
        }
            var response = [];

            /* Get demographics info */
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
            
            /* Start with population */
            client.query('SELECT total_population FROM WellbeingDemographics WHERE UPPER(neighbourhood) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    // res.json(results.rows);

                    console.log(results.rows);
                    var population = results.rows[0].total_population;

                    client.query('SELECT count(*) FROM ambulancestations WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {

                            response.push('Number of Ambulances/population ' + results.rows[0]['count(*)'] + ' / ' + population);
                            

                       client.query('SELECT count(*) FROM childcarecentres WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {

                             response.push('Number of Child Care Centres /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                             // defibrillators

                            client.query('SELECT count(*) FROM defibrillators WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                             if (err) {
                                  console.log(err);
                            } else {

                                   response.push('Number of Defibrillators /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                           client.query('SELECT count(*) FROM earlyyearscentres WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                                 if (err) {
                                        console.log(err);
                                 } else {

                                     response.push('Number of Yearly Year Centres /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                                      // defibrillators
                                  
                        client.query('SELECT count(*) FROM schools WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                                 if (err) {
                                        console.log(err);
                                 } else {
        
                                     response.push('Number of Schools /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                                      // defibrillators

                       client.query('SELECT count(*) FROM wellbeingyouthservices WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                                 if (err) {
                                        console.log(err);
                                 } else {

                                     response.push('Number of Youth Services /population ' + results.rows[0]['count(*)'] + ' / ' + population);
                                      // defibrillators
                                  res.json(response); /* ! */
                             
                             } });
                             }});
                             }});
     
                        }});
                        }});
                        }});

                }
            });
        });
    }


     return {
       getCategories : getCategories,
       getStat       : getStat
  };
}

module.exports = optionsController;