var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//Logger
var logger = require('./src/server/config/logger');

var routesFolder = './src/server/routes';

// pull out Routers
var adminRouter = require(routesFolder + '/adminRoutes')();
var optionsRouter = require(routesFolder + '/optionsRoutes')();

//webpack hot load, development only
if(process.env.NODE_ENV === "development") {
  var webpack = require('webpack');
  var webpackConfig = require('./config/webpack.development.config');
  var compiler = webpack(webpackConfig);
  app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
  }));
  app.use(require("webpack-hot-middleware")(compiler));
}
//end of webpack hot load

//middleware to serve gzip to the client, production only
if(process.env.NODE_ENV === "production") {
  app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });
}
// Set up middleware
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// set up views 
app.set('views', './src/client'); /* TEST CLIENT */

// Set up Routes
app.use('/admin', adminRouter);
app.use('/data', optionsRouter);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'src/client/index.html'));
});

app.listen(3000, function(err) {
    logger.info('Listening at http://... 3000');
}); 
