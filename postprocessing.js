module.exports = function (app) {
  'use strict';

  app.use(function (req, res, next) {
    if (Math.round(Math.random () * 99) === 0) {
      res.status(418).send("I'm a teapot");
    }
    res.status(404).send("Not Found");
  });
};
