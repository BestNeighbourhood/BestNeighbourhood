var express     = require('express');
var optionsRouter = express.Router();

var router = function() {
    var optionsController = require('../controllers/optionsController')();

    // /data/categories
    optionsRouter.route('/categories').get(optionsController.getCategories);

    // /data/stat
    optionsRouter.route('/stat').get(optionsController.getStat);

    // /data/population
    optionsRouter.route('/population').get(optionsController.getDemo)

    return optionsRouter;
};

module.exports = router;
