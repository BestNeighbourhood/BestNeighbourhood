// Logger
// express
const express = require('express');

const authRouter = express.Router();
const passport = require('passport');
const logger = require('../config/logger');
const User = require('../models/userModel');

const router = function () {
  // To login
  authRouter.route('/signIn').post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',

  }));

  // process the signup form
  authRouter.route('/signup').post((req, res) => {
    User.count({}, (err, c) => {
      // Restrist number of admin accounts
      if (c == 2) {
        res.redirect('/');
      } else {
        User.register(new User({ username: req.body.username }), req.body.password, (err, account) => {
          if (err) {
            logger.info(err);
          }

          passport.authenticate('local')(req, res, () => {
            res.redirect('/');
          });
        });
      }
    });
  });


  return authRouter;
};

module.exports = router;
