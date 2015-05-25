/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var courseidKey = "sec for construct course id";
var Hashids = require("hashids"),
  hashids = new Hashids(courseidKey),
  courseHashids = new Hashids(courseidKey);

var tokenHelper = require("../services/tokenHelper.js");
var courseRepository = require("../services/courseRepository/courseRepository.js");

module.exports = {

  create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body);

    //User.findOne({id: req.session.userid}, function (err, user) {
    User.findOne({id: 1}, function (err, user) {
      if (err) {
         return res.notFound();
      }
      console.log(user);
      if (user) {
        Course.create({
          name: req.body.name,
          desc: req.body.desc,
          tutor: user,
          courseType: req.body.courseType ,
          tags: req.body.tag,
          level: req.body.level
        }, function (err, data) {
          if (err) {
            return res.status(err.status).send(err.details);
          };

          return res.status(201).send(data);
        });
      }
      else {
         return res.json({status:400},400);
      }
    });
  }
};
