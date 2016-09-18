var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var pg = require('pg');
var config = require('../db_config.js');

module.exports = function() {
  passport.use(new LocalStrategy (
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(username, password, doneAuth) {
      // connect to database

      pg.connect(config, function(err, client, done) {
        if (err) {
            console.error('Failed to connect to cockroach', err);
        }

        client.query('SELECT id, password FROM users WHERE id = $1 AND password = $2',[username, password], function (err, results) {
          if (err) {
            console.log(err);
            doneAuth(null, false, {message: 'Bad password'});
          } else if (!results || !results.rows[0]) {
            console.log('Invalid credentials');
            doneAuth(null, false, {message: 'Bad password'});
          } else {
            console.log('Logged in');
            var user = results.rows[0].id;
            doneAuth(null, user);
          }
        });
      });
    }
  ));
};
