// Logger
var logger = require('../config/logger');
// express
var express     = require('express');
var authRouter = express.Router();
var passport = require('passport')
var User = require('../models/userModel')

var router = function() {

    // To login
    authRouter.route('/signIn').post(passport.authenticate('local', {
        successRedirect : '/', 
        failureRedirect : '/', 
    
    }));
    
    // process the signup form
    authRouter.route('/signup').post(function(req, res) {
        
        User.count({}, function (err, c) {

            // Restrist number of admin accounts
            if (c == 2) {
                res.redirect('/');
            } else {
                User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
                    if (err) {
                        logger.info(err);
                    }

                    passport.authenticate('local')(req, res, function () {
                        res.redirect('/');
                    });
                });
            }
        });
        
  });



    return authRouter;
};

module.exports = router;
