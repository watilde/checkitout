var request = require('request');
var async = require('async');
var _ = require('underscore');
var exec = require('child_process').exec;
/* @custom area */
var org = 'watilde';
var repo = 'css-filter.js'
var default_branch = 'master';

var url = 'https://api.github.com/repos/' + org + '/' + repo + '/branches';

var options = {
  url: url,
  headers: {
    'User-Agent': 'Awesome-Octocat-App'
  }
};

request(options, function (error, response, body) {
  var branches = JSON.parse(body);
  if (!error && response.statusCode == 200) {
    async.waterfall(function () {
      var name = branch.name;
      var clone_url = 'git@github.com:' + org + '/' + repo + '.git';
      exec('git clone --recursive -b ' + name + ' ' + clone_url + ' branches/' + default_branch,
        function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          } else {
            delete branches.master;
            callback();
          }
        }
      );
    }, async.each(branches, function (branch, callback) {
      var name = branch.name;
      var clone_url = 'git@github.com:' + org + '/' + repo + '.git';
      exec('git clone --recursive --reference branches/' + default_branch + ' -b ' + name + ' ' + clone_url + ' branches/' + name,
        function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
          callback();
        }
      );
    }));
  }
});
