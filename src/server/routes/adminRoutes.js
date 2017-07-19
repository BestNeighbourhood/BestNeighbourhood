var express     = require('express');
var adminRouter = express.Router();
var ensureAuth  = require('../config/auth.js'); 

var router = function() {

    var adminController = require('../controllers/adminController')();

    // Goes through datasets and assigns neighbourhood based on geometry values 
    adminRouter.route('/processDb').get(ensureAuth, adminController.processDb);

    // Loads Categories & Datasets from api service
    adminRouter.route('/loadData').get(ensureAuth, adminController.loadData);

    return adminRouter;
};

module.exports = router;
