'use strict';

var courseRepository = require("../services/courseRepository/courseRepository.js");
var tokenHelper = require("../services/tokenHelper.js");

var urlQuery = require('url');

module.exports = {

  create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body);

    Section.create(
      {
        title: req.body.title,
        desc: req.body.desc,
        course: req.body.course,
        tutor: req.body.tutor,
        module: req.body.module,
        tags: req.body.tags
      } , function (err, newSection) {
        if (err) {
          return res.status(err.status).send(err.details);
        };

        return res.status(201).send(newSection);
      });
  }
};
