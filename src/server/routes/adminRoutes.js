const express = require('express');

const adminRouter = express.Router();
const ensureAuth = require('../config/auth.js');

const router = function () {
  const adminController = require('../controllers/adminController')();

  // Goes through datasets and assigns neighbourhood based on geometry values
  adminRouter.route('/processDb').get(ensureAuth, adminController.processDb);

  // Loads Categories & Datasets from api service
  adminRouter.route('/loadData').get(ensureAuth, adminController.loadData);

  return adminRouter;
};

module.exports = router;
