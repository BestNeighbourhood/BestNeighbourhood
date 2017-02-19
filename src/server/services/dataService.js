var http = require('http');

var dataService = function () {

    var api_key = "98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8";
    var organization = "58090332de44093525000062";

    var host    = 'api.namara.io';

    // https://api.namara.io/v0/data_sets/b746b8d5-8149-4681-83ca-3688227f2406?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
    /**
     *  Get Info about one dataset, to get title - > ['data_set_metas']['title']
     */
    var getDataSetInfo = function (dataSetId, cb) {

        console.log("->> Getting dataSetInfo...");
        var options = {
            host : host,
            path : '/v0/data_sets/' + dataSetId + '?api_key=' + api_key
        };

        var callback = function (response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                 console.log("<<-- dataSetInfo received...");
                 cb(null,  JSON.parse(str));
            }); 
        }

        http.request(options, callback).end();
    };

    /**
     *  Gets list of categories (projects within organization)
     *  To get category title -> [i]['title'], to get dataSets within category [i]['items']
     */
    var getListOfCategories = function (cb) {

         console.log("->> Getting categories...");
        //  http://api.namara.io/v0/organizations/58090332de44093525000062/projects?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
    
        var options = {
            host : host,
            path : '/v0/organizations/' + organization + '/projects?api_key=' + api_key
        };

        var callback = function (response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                 console.log("<<-- Categories received...");
                 cb(null, JSON.parse(str));
            }); 
        }

        http.request(options, callback).end();
    };

    /** 
     * Fetch data from a particular dataSet
     * 
     */
    var selectDataFromDataSet = function (dataSetId, cb) {

        console.log("->> Getting data from data set...");

        var http = require('http');

        // https://api.namara.io/v0/data_sets/ea23ff2c-cc42-4fea-8df3-1677b35538cf/data/en-1?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
        var options = {
            host : host,
            path : '/v0/data_sets/' + dataSetId + '/data/en-1?api_key=' + api_key
        }

        console.log(options)

        var callback = function (response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {

                 console.log("<<-- data from data set received...");
                 cb(null,  JSON.parse(str));
            });      
        };

        http.request(options, callback).end();

    };

    return {
        selectDataFromDataSet : selectDataFromDataSet,
        getListOfCategories   : getListOfCategories,
        getDataSetInfo        : getDataSetInfo
    }; 
};
module.exports = dataService;