var express = require('express');
var _serveIndex = require('serve-index');
var _serveStatic = require('serve-static');

var plankton = require('./plankton.json');
plankton.port = plankton.port || 3000;

var serveIndex = _serveIndex('./', {'icons': true});
var serveStatic = _serveStatic('./');

var app = express();

if (plankton.scripts.preprocessing) {
  require(plankton.scripts.preprocessing)(app);
}

app.use(serveStatic);
app.use(serveIndex);

if (plankton.scripts.postprocessing) {
  require(plankton.scripts.postprocessing)(app);
}

// Listen
app.listen(plankton.port);
