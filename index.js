var Hapi = require('hapi');
var server = new Hapi.Server(3000);

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

// Branches Mirror
server.route([
  {
    method: 'GET',
    path: '/branches',
    handler: function (request, reply) {
      var name = 'master';
      reply('Hello, ' + encodeURIComponent(name) + '!');
    }
  }, {
    method: 'GET',
    path: '/branches/{name}',
    handler: function (request, reply) {
      var name = request.params.name;
      reply('Hello, ' + encodeURIComponent(name) + '!');
    }
  }
]);


server.start(function () {
  console.log('Server running at:', server.info.uri);
});
