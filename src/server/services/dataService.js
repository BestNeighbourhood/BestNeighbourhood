var http = require('http');
var logger = require('../config/logger');

require('dotenv').config()

var dataService = function () {

    var api_key      = process.env.DS_KEY;
    var organization = process.env.DS_ORG;
    var host         = 'api.namara.io';

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
     *  https://api.namara.io/v0/data_sets/b746b8d5-8149-4681-83ca-3688227f2406?api_key={key}
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
     *  To get category title -> [i]['title']
     * 
     *  e.g. :
     *   http://api.namara.io/v0/organizations/{organization_id}/projects?api_key={key}
     */
    var getListOfCategories = function (cb) {
    
        var options = {
            host : host,
            path : '/v0/organizations/' + organization + '/projects?api_key=' + api_key
        };

        makeRequest(options, cb);
    };

    /**
     *  Gets list of datasets within a category 
     * 
     *  e.g. :
     *   http://api.namara.io/v0/organizations/{organization_id}/projects/{project_id}/items?api_key={key}
     */
    var getCategoryItems = function (categoryId, cb) {
        var options = {
            host : host,
            path : '/v0/organizations/' + organization + '/projects/' + categoryId + '/items?api_key=' + api_key
        }

        makeRequest(options, cb);
    }

    /** 
     * Fetch data from a particular dataSet
     *  
     *  e.g. :
     *  https://api.namara.io/v0/data_sets/ea23ff2c-cc42-4fea-8df3-1677b35538cf/data/en-1?api_key={key}
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
        getDataSetInfo        : getDataSetInfo,
        getCategoryItems      : getCategoryItems
    }; 
};
module.exports = dataService;
