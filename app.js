var express = require('express');
var path = require('path');
var app = express();

// Basic authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//Logger
var logger = require('./src/server/config/logger');

var routesFolder = './src/server/routes';

// pull out Routers
var adminRouter   = require(routesFolder + '/adminRoutes')();
var dataRouter    = require(routesFolder + '/dataRoutes')();
var authRouter    = require(routesFolder + '/authRoutes')();

// webpack hot load, development only
if(process.env.NODE_ENV === "development") {
  var webpack = require('webpack');
  var webpackConfig = require('./config/webpack.development.config');
  var compiler = webpack(webpackConfig);
  app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
  }));
  app.use(require("webpack-hot-middleware")(compiler));
}

// *end of webpack hot load

///////////////////////
// Set up middleware //
///////////////////////

//middleware to serve gzip to the client, production only
if(process.env.NODE_ENV === "production") {
  app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });
}

app.use(express.static('dist'));
// Configuring Passport
app.use(session( {secret : 'secret'} ));
app.use(passport.initialize());
app.use(passport.session( {secret : 'secret'} ));
// passport config
var User = require('./src/server/models/userModel');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// set up views 
app.set('views', './public/'); /* TEST CLIENT */

////////////////
// Set up Routes
////////////////

app.use('/admin', adminRouter);
app.use('/data', dataRouter);
app.use('/auth', authRouter);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, function(err) {
    logger.info('Listening at http://... 3000');
}); 
