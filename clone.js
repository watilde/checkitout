var async = require('async');
var request = require('request');
var rimraf = require('rimraf');
var _ = require('underscore');
var exec = require('child_process').exec;
var plankton = require('./plankton.json');

async.waterfall([
  // 1. Clean repos directory
  function (callback) {
    rimraf('./repos', callback);
  },
  // 2. Clone all repos files to feel good
  function (callback) {
    var _repos = plankton.repos;
    var count = 0;
    _.each(_repos, function (repos, owner) {
      count += repos.length;
      _.each(repos, function (repo) {
        var api_url = plankton.urls.api;
        var clone_url = plankton.urls.clone;
        async.waterfall([
          // a. Get a default branch name
          function (callback2) {
            var url = api_url + '/repos/' + owner + '/' + repo;
            request({
              url: url,
              headers: {
                'User-Agent': 'Awesome-Octocat-App'
              }
            }, function (err, res, body) {
              body = JSON.parse(body);
              if (res.statusCode !== 200) {
                console.error('Error: ' + body.message);
                console.error('Documentation URL: ' + body.documentation_url);
                throw new Error('A status code of Github API was not 200');
              }
              if (err !== null && err !== void 0) {
                console.error('res: ' + JSON.stringify(res, null, 4));
                console.error('body: ' + JSON.stringify(body, null, 4));
                throw new Error(err);
              }
              callback2(null, body.default_branch);
            });
          },
          // b. Clone a default branch
          function (default_branch, callback2) {
            var incantation = 'git clone';
            incantation += ' --recursive';
            incantation += ' -b ' + default_branch;
            incantation += ' ' + clone_url + ':' + owner + '/' + repo;
            incantation += ' repos/' + owner + '/' + repo + '/branches/' + default_branch;
            console.info('Exec: ' + incantation);
            exec(incantation, function (err, stdout, stderr) {
              if (err !== null && err !== void 0) {
                console.error('stdout: ' + stdout);
                console.error('stderr: ' + stderr);
                throw new Error(err);
              }
              console.info('Done: ' + incantation);
              callback2(null, default_branch);
            });
          },
          // c. Clone all branches reference a default branch
          function (default_branch, callback2) {
            async.waterfall([
              function (callback3) {
                var url = api_url + '/repos/' + owner + '/' + repo + '/branches';
                var options = {
                  url: url,
                  headers: {
                    'User-Agent': 'Awesome-Octocat-App'
                  }
                };
                request(options, function (err, res, body) {
                  var branches = body;
                  branches = body = JSON.parse(body);
                  if (res.statusCode !== 200) {
                    console.error('Error: ' + body.message);
                    console.error('Documentation URL: ' + body.documentation_url);
                    throw new Error('A status code of Github API was not 200');
                  }
                  if (err !== null && err !== void 0) {
                    console.error('res: ' + JSON.stringify(res, null, 4));
                    console.error('body: ' + JSON.stringify(body, null, 4));
                    throw new Error(err);
                  }
                  branches = branches.filter(function (branch) {
                    return default_branch !== branch.name;
                  });
                  callback3(null, branches);
                });
              },
              function (branches, callback3) {
                async.each(branches, function (branch, callback4) {
                  var branch_name = branch.name;
                  var incantation = 'git clone';
                  incantation += ' --recursive';
                  incantation += ' --reference repos/' + owner + '/' + repo + '/branches/' + default_branch;
                  incantation += ' -b ' + branch_name;
                  incantation += ' ' + clone_url + ':' + owner + '/' + repo;
                  incantation += ' repos/' + owner + '/' + repo + '/branches/' + branch_name;
                  console.info('Exec: ' + incantation);
                  exec(incantation, function (err, stdout, stderr) {
                    if (err !== null && err !== void 0) {
                      console.error('stdout: ' + stdout);
                      console.error('stderr: ' + stderr);
                      throw new Error(err);
                    }
                    console.info('Done: ' + incantation);
                    callback4();
                  });
                }, callback3);
              }
            ], callback2);
          }
        ], function () {
          count -= 1;
          if (count === 0) {
            callback();
          }
        });
      });
    });
  }
], function (err, result) {
   // result now equals 'done'
  if (err !== null && err !== void 0) {
    console.error('result: ' + result);
    throw new Error(err);
  }
  console.info('All done clone every repos');
});
