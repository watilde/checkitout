var request = require('request');
var _ = require('underscore');
var org = 'watilde';
var repo = 'css-filter.js'
var url = 'https://api.github.com/repos/' + org + '/' + repo + '/branches';
var exec = require('child_process').exec;

var options = {
  url: url,
  headers: {
    'User-Agent': 'Awesome-Octocat-App'
  }
};

request(options, function (error, response, body) {
  var branches = JSON.parse(body);
  if (!error && response.statusCode == 200) {
    _.each(branches, function (branch) {
      var name = branch.name;
      var clone_url = 'git@github.com:' + org + '/' + repo + '.git';
      exec('git clone -b ' + name + ' ' + clone_url + ' branches/' + name,
        function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }          
      });
    });
  }
});
