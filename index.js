var fs = require('fs');
var connect = require('connect')
var http = require('http');
var _ = require('underscore');

var app = connect()

app.use('/branches', function fooMiddleware(req, res, next) {
  var path = __dirname + '/branches/' + req.url;
  var cont;
  if (fs.lstatSync(path).isDirectory()) {
    cont = fs.readdirSync(path);
    cont = JSON.stringify(cont);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(cont);
  } else {
    cont = fs.readFileSync(path);
    res.write(cont);
  }
  res.end();
});

http.createServer(app).listen(3000)
