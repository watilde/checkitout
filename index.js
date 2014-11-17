var express = require('express');
var _serveIndex = require('serve-index');
var _serveStatic = require('serve-static');
var fs = require('fs');
var ssi = require('ssi');

var serveIndex = _serveIndex('./', {'icons': true});
var serveStatic = _serveStatic('./');


var app = express();

// Support Server Side Includes
app.use(function (req, res, next) {
  var filename = '.' + req.path;
  var isShtml = (filename.split('.').pop() === 'shtml');
  if (fs.existsSync(filename) === false) return next();
  if (isShtml === false) return next();

  var parser = new ssi(__dirname, '', '');
  var data = fs.readFileSync(filename, {encoding: 'utf8'});
  var content = parser.parse(filename, data).contents;

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(content, 'utf8')
  });
  res.end(content);
});

app.use(serveStatic);
app.use(serveIndex);

// Listen
app.listen(3000);
