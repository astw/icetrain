var Q = require("q");
var fs = require('fs'),
  util = require('util');

var path = require("path")
var root = require('app-root-path') + "";

var cache = Object();  //place hold of cache

var getCourseSectionInfo = function (courseId, sectionId) {
  return getCourseSectionInfoStub(courseId, sectionId);
};
var getCourseSectionInfoStub = function (courseId, sectionId) {
  var defer = Q.defer();

  var gcourse;
  var gsection;

  Course.findOne({id: courseId})
    .then(function (course) {
      gcourse = course;
      CourseSection.findOne({courseid: courseId})
        .then(function (courseSection) {
          gsection = courseSection;
          Video.find({courseid: courseId, sectionid: sectionId})
            .then(function (videos) {
              console.dir(videos);
              var courseInfo = {
                course: gcourse,
                section: gsection,
                videos: videos
              };
              defer.resolve(courseInfo);
            });
        })
    });

  return defer.promise;
};


var updateCourseSectionVideoInfo = function (courseInfo, courseId, sectionId){
  var defer = Q.defer();


  var courseInfo ={
    "token" :"<%= token%>",
    "courseInfo":
    {
      "courseName" : courseName ||"",
      "courseDescription" : courseDescription  ||"",
      "courseLevel" : courseLevel,
      "courseTags" : courseTags ||"",
      "sectionName": sectionName ||"",
      "sectionTags": sectionTags ||"",
      "sectionDescription": sectionDescription ||"",
      "videoOrders" : videoOrders,
      "videoNames" :videoNames
    }};
}

module.exports = {
  // return all course information, like course info, section info, video info, by course Id
  getCourseSectionInfo: getCourseSectionInfo,

  saveOrUpdateAllCourse: function (courseInfo, courseId, sectionId) {

  }
}
