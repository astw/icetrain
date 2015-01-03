'use strict';

var courseRepository = require("../services/courseRepository/courseRepository.js");
var tokenHelper = require("../services/tokenHelper.js");

var urlQuery = require('url');

module.exports = {

  showCreateSectionUI: function (req, res) {
    var courseToken = req.params.courseToken;
    res.view("create-section", {courseToken: courseToken});
  },

  create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body);
    var token = urlQuery.parse(req.url, true).query.token;
    var ids = tokenHelper.getCourseId(token);    // courseHashids.decode(token);
    var courseId = ids[0];
    var tutorId = ids[1];

    CourseSection.create({
      title: req.body.sectionTitle,
      desc: req.body.sectionDesc,
      courseid: courseId,
      tutorid: tutorId,
      tags: req.body.sectionTags
    }, function (err, data) {
      if (err != null) {
        res.writeHead(400, {"Location": "/error"})
      } ;
      //token = courseHashids.encode([tutorId, courseId, data.id]);
      token = tokenHelper.getSectionToken([tutorId, courseId, data.id]);
      res.redirect("/upload-video/" + token);
      res.end();
    });
  },

  editCourseSections: function (req, res) {
    console.log(req.body);

    var token = req.params.courseToken;
    //var ids = courseHashids.decode(token);
    var ids = tokenHelper.getSectionId(token);

    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];
    var videoId = ids[3];

    if (req.method === 'GET') {
      courseRepository.getCourseSectionInfo(courseId, sectionId)
        .then(function (courseInfo) {
          console.dir("-------courseInfo-------------");
          res.view("editCourseSections", {token: token, courseInfo: courseInfo});
        });
    }
    else if (req.method == 'POST') {
      var courseInfo = req.body.courseInfo;
      var tutorId = courseInfo.tutorId;

        courseRepository.saveOrUpdateAllCourse(courseInfo, courseId,sectionId)
        .then(function (courseInfo) {
            // redirect to user's course page
            res.contentType("application/json");
            var data = JSON.stringify("/courses/byuser/" + tutorId);
            res.header('Content-Length',data.length);
            res.end(data);
        });
    }
  },
  getCourseSection : function(req, res){
    var courseToken = req.params.courseToken;
    var sectionToken = req.params.sectionToken;

    var courseId = tokenHelper.getCourseId(courseToken)[0];
    var sectionId = tokenHelper.getSectionId(sectionToken)[0];

    courseRepository.getCourseSectionInfo(courseId, sectionId)
      .then(function (courseInfo) {
        res.view("sectionInfo", {courseToken: courseToken, sectionToken: sectionToken, courseInfo: courseInfo});
      });
  },

  editSection : function(req, res){
    var courseToken = req.params.courseToken;
    var sectionToken = req.params.sectionToken;

    var courseId = tokenHelper.getCourseId(courseToken)[0];
    var sectionId = tokenHelper.getSectionId(sectionToken)[0];

    if(req.method ==="GET") {
      courseRepository.getCourseSectionInfo(courseId, sectionId)
        .then(function (courseInfo) {
          var tutorId = courseInfo.course.tutorid;
          var sectionId = courseInfo.section.id;
          var token = tokenHelper.getSectionToken([tutorId, courseId, sectionId]);
          res.view("editSection", {
            token: token,
            courseToken: courseToken,
            sectionToken: sectionToken,
            courseInfo: courseInfo
          });
        });
    }
    else {
      var sectionInfo = req.body.sectionInfo;

      courseRepository.saveOrUpdateAllSection(sectionInfo, courseId,sectionId)
        .then(function (sectionInfo) {
          res.contentType("application/json");
          var data = JSON.stringify("/courses/"+courseToken+"/sections/" + sectionToken);
          res.header('Content-Length',data.length);
          res.end(data);
        });
    }
  }
};
