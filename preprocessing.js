module.exports = function (app) {
  'use strict';
  var fs = require('fs');
  var ssi = require('ssi');

  // Supports Server Side Includes
  app.use(function (req, res, next) {
    var filename = '.' + req.path;
    var isShtml = (filename.split('.').pop() === 'shtml'
      // And also supports using html extension
      || filename.split('.').pop() === 'html');
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
};
