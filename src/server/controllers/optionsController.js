var config = require('../config/db_config');
var nb_borders = require('../../data/neighborhoods_borders.js');

// category - title
var optionsController = function() {
 
    /* Get Categories and Subcategories  [category , tables [ title ]]  */
    var getCategories = function (req, res) {
         res.json(TablesOptions);
    }


    /* slider range 0...100  : getTop?nbrhoods= &importance= {category & rating from 0 to 1000}*/
    // neighborhood.area_name.substring(0,neighborhood.area_name.indexOf('('))
    var getTopNeighbourhood = function (req, res) {
        var json = require('./test.json');
        var tables = json['tables'];
        var analysis = [
            { neighborhood : "", occumulateRating : 0 }
        ];   
    }


    var findCountForNbrHood = function (nbrhood, tableName) {
         pg.connect(config, function(err, client, done) {
                   var finish = function() {
                       done();
                       process.exit();
                   }

                   if (err) {
                        console.error('Failed to connect to cockroach', err);
                        finish();
                   }
            
                    client.query('SELECT count(*) FROM '+ tableName +' WHERE TRIM(UPPER(neighbourhood)) = ' + "UPPER('" + nbrhood + "')", function (err, results) {
                        if (err) {
                            console.log(err);
                            finish();
                        } else {
                            return results.rows[0]['count(*)']; 
                    } });
               });
    }

    /* Get statistics for neighbourhood : sample usage : getStat?nbrhood=""*/
    var getStat = function (req, res) {
        var nbrhood = req.query.nbrhood;
        
        if(!nbrhood) {
            res.send(401);
        }
        
        var response = [];
    }


     return {
       getCategories : getCategories,
       getStat       : getStat,
       getTop        : getTopNeighbourhood
  };
}

module.exports = optionsController;