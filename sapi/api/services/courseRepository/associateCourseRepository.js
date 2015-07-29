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
        videos.forEach(function(video){
          video.id = video.playtoken();
          delete video.path;
        });
        module.videoCollection = videos;
        return module;
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
   // Course.find({id:courseId}).populate('modules').then(function (course) {
    Course.findOne({id:courseId}).populateAll().then(function (course) {
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
    console.log(req.session.userid);

    User.findOne({id: req.session.userid}, function (err, user) {
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

var getCoursesByTutor = function(req,res){
   var tutorId = req.params.userId;
  return Course.find({tutor: tutorId})
}

var updateCourseById = function (courseId, courseInfo) {
  var defer = Q.defer();
  Course.findOne({id:courseId}).then(function(course){
    course.name = courseInfo.name;
    course.desc = courseInfo.desc;
    course.level = courseInfo.level;
    course.coursetype = courseInfo.courseType;
    course.save().then(function(err){
      userRepository.getUserById(course.tutorid).then(function(tutor){
        course.tutor = tutor;
        Section.find({courseid:course.id}).then(function(sections){
          course.sections = sections;
          defer.resolve(course);
        })
      });
    });
    defer.resolve(course);
  });

  return defer.promise;
};

module.exports = {

  getCourseById : getCourseById,
  getCoursesByTutor:getCoursesByTutor,
  getCourseComplexModules: getCourseComplexModules,
  createCourse:createCourse,
  updateCourseById : updateCourseById

}

