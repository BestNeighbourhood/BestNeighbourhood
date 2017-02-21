var http = require('http');
//Logger
var logger = require('../config/logger');

var dataService = function () {

    var api_key = "98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8";
    var organization = "58090332de44093525000062";
    var host    = 'api.namara.io';

    /**
     *  Wrapper function for http request
     *  
     */
    var makeRequest = function (options, cb) {

        var callback = function (response) {
            var str = '';

            if (response.statusCode < 200 || response.statusCode > 299) {
                var errMsg = 'Failed to execute http request, client returned with a status code : ' + response.statusCode;
                cb(errMsg, '');
            }

            response.on('data', function(chunk) {
                str += chunk;
            });
            response.on('end', function() {
                 cb(null,  JSON.parse(str));
            }); 
        }

        http.request(options, callback).end();
    };

    /**
     *  Get Info about one dataset, to get title - > ['data_set_metas']['title']
     *  
     *  e.g. :
     *  https://api.namara.io/v0/data_sets/b746b8d5-8149-4681-83ca-3688227f2406?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
     */
    var getDataSetInfo = function (dataSetId, cb) {

        var options = {
            host : host,
            path : '/v0/data_sets/' + dataSetId + '?api_key=' + api_key
        };

        makeRequest(options, cb);
    };

    /**
     *  Gets list of categories (projects within organization)
     *  To get category title -> [i]['title'], to get dataSets within category [i]['items']
     * 
     *  e.g. :
     *   http://api.namara.io/v0/organizations/58090332de44093525000062/projects?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
     */
    var getListOfCategories = function (cb) {
    
        var options = {
            host : host,
            path : '/v0/organizations/' + organization + '/projects?api_key=' + api_key
        };

        makeRequest(options, cb);
    };

    /** 
     * Fetch data from a particular dataSet
     *  
     *  e.g. :
     *  https://api.namara.io/v0/data_sets/ea23ff2c-cc42-4fea-8df3-1677b35538cf/data/en-1?api_key=98c561bd55188933cb81609c0ae4541e87f3f2eb5e86e4e5678bf6a4d8da0fd8
     */
    var selectDataFromDataSet = function (dataSetId, dataSetVersion, cb) {

        var options = {
            host : host,
            path : '/v0/data_sets/' + dataSetId + '/data/' + dataSetVersion + '?api_key=' + api_key
        }

        makeRequest(options, cb);
    };

    return {
        selectDataFromDataSet : selectDataFromDataSet,
        getListOfCategories   : getListOfCategories,
        getDataSetInfo        : getDataSetInfo
    }; 
};
module.exports = dataService;
