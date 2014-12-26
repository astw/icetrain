/**
 * CourseSectionController
 *
 * @description :: Server-side logic for managing coursesections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var courseRepository = require("../services/courseRepository/courseRepository.js");

var urlQuery = require('url');
var courseidKey = "sec for construct course id";
var sectionKey = "sec for construct couse section id";
var Hashids = require("hashids"),
  courseHashids = new Hashids(courseidKey),
  sectionHashids = new Hashids(sectionKey);

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
    var ids = courseHashids.decode(token);
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

      token = courseHashids.encode([tutorId, courseId, data.id]);
      res.redirect("/upload-video/" + token);
      res.end();
    });
  },

  editCourseSections: function (req, res) {
    console.log(req.body);

    var token = req.params.courseToken;
    var ids = courseHashids.decode(token);
    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];
    var videoId = ids[3];

    if (req.method === 'GET') {
      courseRepository.getCourseSectionInfo(courseId, sectionId)
        .then(function (courseInfo) {
          res.view("editCourseSections", {token: token, courseInfo: courseInfo});
        });
    }
    else if (req.method == 'POST') {
      var courseInfo = req.body.courseInfo;
        courseRepository.saveOrUpdateAllCourse(courseInfo, courseId,sectionId)
        .then(function (courseInfo) {
          res.view("editCourseSections", {token: token, courseInfo: courseInfo});
        });
    }
  },

  postCourseSections: function (req, res) {

  }
}
