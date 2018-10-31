const express = require('express');

const dataRouter = express.Router();

const router = function () {
  const dataController = require('../controllers/dataController')();

  dataRouter.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // /data/categories
  dataRouter.route('/categories').get(dataController.getCategories);

  // /data/stat
  dataRouter.route('/stat').get(dataController.getStat);

  // /data/population
  dataRouter.route('/population').get(dataController.getDemo);

  return dataRouter;
};

module.exports = router;
