var express     = require('express');
var optionsRouter = express.Router();

var router = function() {
  var optionsController = require('../controllers/optionsController')();
  optionsRouter.route('/')
              .get(optionsController.getCategories);

 optionsRouter.route('/getStat').get(optionsController.getStat);

 optionsRouter.route('/getTop').get(optionsController.getTop);

  return optionsRouter;
};

module.exports = router;
