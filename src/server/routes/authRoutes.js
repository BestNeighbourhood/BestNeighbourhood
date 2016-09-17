var express     = require('express');
/* Postgre to connect to db */
var pg = require('pg');
var config = require('../config/db_config.js');

var authRouter = express.Router();
var passport   = require('passport');
/* TODO: connect to db*/

var router = function() {
  authRouter.route('/signIn')
    .post(passport.authenticate('local', {
        failureRedirect: '/signIn'
    }), function (req, res) {
        res.redirect('/auth/profile');
    });
  authRouter.route('/profile')
    .all(function (req, res, next) {
      if (!req.user) {
        res.status(501)        // HTTP status 404: NotFound
            .send('NO ACCESS');
      }
      next();
    })
    .get(function (req, res) {
      res.json(req.user);
    });

  authRouter.route('/signUp').post(function (req, res)
  {
    var user = {
      username : req.body.userName,
      password : req.body.password
    };

    pg.connect(config, function(err, client, done) {
      // Closes communication with the database and exits.
      var finish = function () {
        done();
        process.exit();
      };

      if (err) {
        console.error('Failed to connect to cockroach', err);
        finish();
      }


      client.query('INSERT into users (id, password) VALUES($1, $2)',[user.username, user.password], function (err, results) {
        if (err) {
          console.log(err);
          finish();
          res.redirect('/auth/profile');
        } else {
            req.login(user.username, function(){
                res.redirect('/');
            });
        }
      });
    });
  });

    return authRouter;
};

module.exports = router;
