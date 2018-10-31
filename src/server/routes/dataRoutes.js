var express     = require('express');
var dataRouter = express.Router();

var router = function() {
    var dataController = require('../controllers/dataController')();

    dataRouter.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // /data/categories
    dataRouter.route('/categories').get(dataController.getCategories);

    // /data/stat
    dataRouter.route('/stat').get(dataController.getStat);

    // /data/population
    dataRouter.route('/population').get(dataController.getDemo)

    return dataRouter;
};

module.exports = router;
