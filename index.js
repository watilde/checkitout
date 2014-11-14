var finalhandler = require('finalhandler');
var serveIndex = require('serve-index');
var connect = require('connect');
var serveStatic = require('serve-static');
var connectInclude = require('connect-include');

var index = serveIndex('./', {'icons': true});
var serve = serveStatic('./');
var include = connectInclude('./');

var app = connect();

// Create server
app.use(function (req, res) {
  var done = finalhandler(req, res);
  include(req, res ,function (err) {
    if (err) return done(err);
    serve(req, res, function (err) {
      if (err) return done(err);
      index(req, res, done);
    });
  });
});

// Listen
app.listen(3000);
