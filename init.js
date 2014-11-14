var request = require('request');
var async = require('async');
var _ = require('underscore');
var exec = require('child_process').exec;
/* @custom area */
var org = 'watilde';
var repo = 'css-filter.js'
var default_branch = 'master';

var url = 'https://api.github.com/repos/' + org + '/' + repo + '/branches';
var clone_url = 'git@github.com:' + org + '/' + repo + '.git';
var branches;

var options = {
  url: url,
  headers: {
    'User-Agent': 'Awesome-Octocat-App'
  }
};

var getMaster = function (callback) {
  exec('git clone --recursive -b ' + default_branch + ' ' + clone_url + ' repos/' + repo + '/branches/' + default_branch,
    function (err, stdout, stderr) {
      console.log(err);
      console.log(stdout);
      console.log(stderr);

      if (error === null) {
        branches.filter(function (elem){
          return elem !== default_branch;
        });
        callback(null);
      }
    }
  );
};

var getRepos = function (done) {
  async.each(branches, function (branch, callback) {
    var name = branch.name;
    var clone_url = 'git@github.com:' + org + '/' + repo + '.git';
    exec('git clone --recursive --reference repos/' + repo + '/branches/' + default_branch + ' -b ' + name + ' ' + clone_url + ' repos/' + repo + '/branches/' + name,
      function (error, stdout, stderr) {
        if (error === null) {
          callback();
        }
      }
    );
  }, done);
};

request(options, function (error, response, body) {
  branches = body = JSON.parse(body);
  if (error || response.statusCode !== 200) {
    body.status_code = response.statusCode;
    console.error(JSON.stringify(body, null, 4));
    return false;
  }

  async.waterfall([getMaster, getRepos]);
});
