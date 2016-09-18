var express     = require('express');
var optionsRouter = express.Router();

var router = function() {
  var optionsController = require('../controllers/optionsController')();

  /* get all */
  optionsRouter.route('/')
              .get(optionsController.getCategories);

 optionsRouter.route('/getStat').get(optionsController.getStat);

  return optionsRouter;
};

module.exports = router;
