var express = require('express');
var _serveIndex = require('serve-index');
var _serveStatic = require('serve-static');
var fs = require('fs');

var serveIndex = _serveIndex('./', {'icons': true});
var serveStatic = _serveStatic('./');


var app = express();

// Create server
app.use(function (req, res, next) {
  var shtml = (req.path.split('.').pop() === 'shtml');
  if (!shtml) return next();
  var data = fs.readFileSync('.' + req.path);
  console.log(data);
  next();
});

app.use(serveStatic);
app.use(serveIndex);

// Listen
app.listen(3000);
