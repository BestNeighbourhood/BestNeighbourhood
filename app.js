var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');


var routesFolder = './src/server/routes';

// pull out Routers
var authRouter = require(routesFolder + '/authRoutes')();
var adminRouter = require(routesFolder + '/adminRoutes')();


// Set up middleware
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'bloomisgreat', resave: true, saveUninitialized: true}));

require('./src/server/config/passport')(app);

// set up views 
app.set('views', './src/client'); /* TEST CLIENT */

// Set up Routes
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'src/client/index.html'));
});

app.listen(3000, function(err) {
    console.log('Listening at http://... 3000');
}); 
