'use restrict'
var Q = require("q");
var courseidKey = "sec for construct course id";
var Hashids = require("hashids"),
  hashids = new Hashids(courseidKey),
  courseHashids = new Hashids(courseidKey);
var tokenHelper = require("../tokenHelper.js");

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

fillVideoInfo = function(modules){
  if(! modules) return;
  var result = [];
  modules.forEach(function (module) {
    result.push(
      Video.find({module:module.id}).then(function (videos) {
        module.videoCollection = videos;return module;
      }));
  });

  return Q.all(result);
};
var getCourseModules = function(req, res) {
  var courseId = parseInt(req.params.id);
  var defer = Q.defer();
  Module.find({course:courseId}).then(function (modules) {
    defer.resolve(modules);
  });
  return defer.promise;
};

var getCourseComplexModules = function(req, res) {
  getCourseModules(req,res).then(function(modules){
    fillVideoInfo(modules).then(function(m){
      return res.status(200).send(m);
    });
  });
};

getCourseById = function(req, res){
  // var enId = req.params.enId ;
  // var courseId = tokenHelper.getCourseId(enId)[0];
  var courseId = req.params.id;
  if(courseId != null) {
    Course.find({id:courseId}).populate('modules').then(function (course) {
       return res.status(200).send(course);
      }
    ).error(function(err){
         return res.status(404).send(err);
      });
  }
};

createCourse = function (req, res) {
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

module.exports = {

  getCourseById : getCourseById,
  getCourseComplexModules: getCourseComplexModules,
  createCourse:createCourse

}

