var express = require('express');
var _serveIndex = require('serve-index');
var _serveStatic = require('serve-static');

var checkitout = require('./checkitout.json');
checkitout.port = checkitout.port || 3000;

var serveIndex = _serveIndex('./', {'icons': true});
var serveStatic = _serveStatic('./');

var app = express();

if (checkitout.scripts.preprocessing) {
  require(checkitout.scripts.preprocessing)(app);
}

app.use('/postreceive', function (req, res, next) {
  console.log(req);
  res.end();
});
app.use(serveStatic);
app.use(serveIndex);

if (checkitout.scripts.postprocessing) {
  require(checkitout.scripts.postprocessing)(app);
}

// Listen
app.listen(checkitout.port);
