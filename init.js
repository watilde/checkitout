var request = require('request');
var async = require('async');
var rimraf = require('rimraf');
var exec = require('child_process').exec;

/* @custom area */
var owner = 'watilde';
var repo = 'css-filter.js'
var default_branch;

var url = 'https://api.github.com/repos/' + owner + '/' + repo + '/branches';
var clone_url = 'git@github.com:' + owner + '/' + repo + '.git';
var branches;

var options = {
  url: url,
  headers: {
    'User-Agent': 'Awesome-Octocat-App'
  }
};

var getMaster = function (callback) {
  exec('git clone --recursive -b ' + default_branch + ' ' + clone_url + ' repos/' + owner + '/'+ repo + '/branches/' + default_branch,
    function (err, stdout, stderr) {
      if (err === null) {
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
    var clone_url = 'git@github.com:' + owner + '/' + repo + '.git';
    exec('git clone --recursive --reference repos/' + owner + '/' + repo + '/branches/' + default_branch
      + ' -b ' + name + ' ' + clone_url + ' repos/' + owner + '/' + repo + '/branches/' + name,
      function (err, stdout, stderr) {
        callback();
      }
    );
  }, done);
};

async.waterfall([function (callback) {
  request({
    url: 'https://api.github.com/repos/' + owner + '/' + repo,
    headers: {
      'User-Agent': 'Awesome-Octocat-App'
    }
  }, function (error, response, body) {
    body = JSON.parse(body);
    default_branch = body.default_branch;
    callback();
  });
}, function (callback) {
  request(options, function (error, response, body) {
  branches = body = JSON.parse(body);
  if (error || response.statusCode !== 200) {
      body.status_code = response.statusCode;
      console.error(JSON.stringify(body, null, 4));
      return false;
    }

    async.waterfall([getMaster, getRepos]);
    callback();
  });
}]);
