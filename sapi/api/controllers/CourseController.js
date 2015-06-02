/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require("q");
var courseidKey = "sec for construct course id";
var Hashids = require("hashids"),
  hashids = new Hashids(courseidKey),
  courseHashids = new Hashids(courseidKey);

var tokenHelper = require("../services/tokenHelper.js");
var courseRepository = require("../services/courseRepository/courseRepository.js");

var getCourseByTutor = function(tutorId){
  var result = [];
  return Course.find({tutorid: tutorId})
    .then(function (courses) {
      courses.forEach(function (course) {
        result.push(
          course.getSections().then(function (sections) {
            course.sections = sections;
            return course;
          }));
      });
      return Q.all(result);
    });
};

var getCourseModules = function(req, res) {

  var courseId = parseInt(req.params.id);
  var defer = Q.defer();
  Module.find({id:courseId}).then(function (modules) {
    defer.resolve(modules);
  });
   return defer.promise;
};

getCourseById = function(req, res){
  var enId = req.params.enId ;
  var courseId = tokenHelper.getCourseId(enId)[0];
  if(courseId != null) {
    courseRepository.getCourseById(courseId).then(function (course) {
        res.view("courseInfo", {course: course});
      }
    );
  }
  else{
    res.view("error");
  }
}

module.exports = {

  getCourseById : getCourseById,
  getCourseModules: getCourseModules,
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
