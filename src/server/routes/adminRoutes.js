var express     = require('express');
var adminRouter = express.Router();

var router = function() {

    var adminController = require('../controllers/adminController')();

    // goes through datasets and assigns neighbourhood based on geometry values 
    adminRouter.route('/processDb').get(adminController.processDb);

    // Load Categories & Datasets from service api
    adminRouter.route('/loadData').get(adminController.loadData);

    return adminRouter;
};

module.exports = router;
