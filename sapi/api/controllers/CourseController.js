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

          var shortToken = hashids.encode([data.id, user.id]);
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
    var token = req.params.courseToken;
    var ids = courseHashids.decode(token);
    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];
    var videoId = ids[3];

    courseRepository.getCourseByTutor(tutorId)
      .then(function (courses) {

        res.view("courseslist", {tutorId: tutorId, courses: courses});
      });
  },

  getCourseById : function(req, res){
    res.view("course");
  }

};

