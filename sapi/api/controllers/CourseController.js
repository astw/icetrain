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

    User.findOne({email: req.body.tutorEmail}, function (err, user) {
      if (err) {
        throw err;
      }
      console.log(user);
      if (user) {
        Course.create({
          name: req.body.courseName,
          desc: req.body.courseDesc,
          tutorid: user.id,
          coursetype: req.body.courseType,
          tags: req.body.courseTags,
          leve: req.body.courseLevel
        }, function (err, data) {
          if (err) {
            res.writeHead(400, {"Location": "/error"}) } ;

          //var shortToken = hashids.encode([data.id, user.id]);
          var shortToken = tokenHelper.getCourseToken([data.id, user.id]);
          res.redirect("/courses/" + shortToken + "/create-section");
          res.end();
        });
      }
      else {
        res.writeHead(400, {"Location": "/error"});
        res.end();
      }
    });
  },

  getUserCourses: function (req, res) {
    var userId = req.params.userId;
    //var ids = courseHashids.decode(token);
    //var tutorId = ids[0];
    //var courseId = ids[1];
    //var sectionId = ids[2];
    //var videoId = ids[3];

    courseRepository.getCourseByTutor(userId)
      .then(function (courses) {
        res.view("myCoursesList", {tutorId: userId, courses: courses});
      });
  },

  getCourseById : function(req, res){
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
  },

  updateCourseById : function(req,res){

    var enId = req.params.enId;
    var courseId = tokenHelper.getCourseId(enId)[0];

    if (req.method === 'GET')
    {
      courseRepository.getCourseById(courseId).then(function (course) {
          res.view("editCourse", {course: course});
        }
      );
    }
    else if(req.method==='POST') {

      var courseInfo = req.body.courseInfo;
      if (courseId != null) {
        courseRepository.updateCourseById(courseId, courseInfo).then(function (course) {
            res.contentType("application/json");
            var data = JSON.stringify("/courses/byid/" + course.enId());
            res.header('Content-Length', data.length);
            res.end(data);
          }
        );
      }
      else {
        res.view("error");
      }
    }
  }

};

