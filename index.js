var finalhandler = require('finalhandler');
var http = require('http');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');

var index = serveIndex('./', {'icons': true});
var serve = serveStatic('./');

// Create server
var server = http.createServer(function onRequest(req, res){
  var done = finalhandler(req, res);
  serve(req, res, function (err) {
    if (err) return done(err)
    index(req, res, done);
  });
})

// Listen
server.listen(3000)
