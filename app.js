var express = require('express');

var app = express();

var path = require('path');

app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/client/index.html'));
});

app.listen(3000, function(err) {
  console.log('Listening at http://... 3000');
});