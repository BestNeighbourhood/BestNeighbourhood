const http = require('http');
const logger = require('../config/logger');

require('dotenv').config();

const dataService = function () {
  const api_key = process.env.DS_KEY;
  const organization = process.env.DS_ORG;
  const host = 'api.namara.io';

  /**
     *  Wrapper function for http request
     *
     */
  const makeRequest = function (options, cb) {
    const callback = function (response) {
      let str = '';

      if (response.statusCode < 200 || response.statusCode > 299) {
        const errMsg = `Failed to execute http request, client returned with a status code : ${response.statusCode}`;
        cb(errMsg, '');
      }

      response.on('data', (chunk) => {
        str += chunk;
      });
      response.on('end', () => {
        cb(null, JSON.parse(str));
      });
    };

    http.request(options, callback).end();
  };

  /**
     *  Get Info about one dataset, to get title - > ['data_set_metas']['title']
     *
     *  e.g. :
     *  https://api.namara.io/v0/data_sets/b746b8d5-8149-4681-83ca-3688227f2406?api_key={key}
     */
  const getDataSetInfo = function (dataSetId, cb) {
    const options = {
      host,
      path: `/v0/data_sets/${dataSetId}?api_key=${api_key}`,
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
  const getListOfCategories = function (cb) {
    const options = {
      host,
      path: `/v0/organizations/${organization}/projects?api_key=${api_key}`,
    };

    makeRequest(options, cb);
  };

  /**
     *  Gets list of datasets within a category
     *
     *  e.g. :
     *   http://api.namara.io/v0/organizations/{organization_id}/projects/{project_id}/items?api_key={key}
     */
  const getCategoryItems = function (categoryId, cb) {
    const options = {
      host,
      path: `/v0/organizations/${organization}/projects/${categoryId}/items?api_key=${api_key}`,
    };

    makeRequest(options, cb);
  };

  /**
     * Fetch data from a particular dataSet
     *
     *  e.g. :
     *  https://api.namara.io/v0/data_sets/ea23ff2c-cc42-4fea-8df3-1677b35538cf/data/en-1?api_key={key}
     */
  const selectDataFromDataSet = function (dataSetId, dataSetVersion, cb) {
    const options = {
      host,
      path: `/v0/data_sets/${dataSetId}/data/${dataSetVersion}?api_key=${api_key}`,
    };

    makeRequest(options, cb);
  };

  return {
    selectDataFromDataSet,
    getListOfCategories,
    getDataSetInfo,
    getCategoryItems,
  };
};
module.exports = dataService;
