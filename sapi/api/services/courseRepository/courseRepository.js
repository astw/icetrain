var Q = require("q");
var fs = require('fs'),
  util = require('util');

var path = require("path")
var root = require('app-root-path') + "";

var mediaTokenHelper = require("../tokenHelper.js");
var userRepository = require("../Repository/userRepository");

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
      CourseSection.findOne({id: sectionId})
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

var updateCourseInfo = function (courseId, name, desc, level, tags) {
  var defer = Q.defer();
  Course.findOne({id: courseId})
    .then(function (course) {

      course.name = name;
      course.desc = desc;
      course.level = level;
      course.tags = tags;
      course.save( defer.resolve);
      defer.resolve(course);
    });

  return defer.promise;
};

var updateCourseSectionInfo = function (courseId, sectionId, name, desc, tags) {
  var defer = Q.defer();
  CourseSection.findOne({courseid: courseId, id: sectionId})
    .then(function (section) {
      section.title = name;
      section.description = desc;
      section.tags = tags;
      section.save();
      defer.resolve(section);
    });

  return defer.promise;
};

var updateVideoInfo = function (courseId, sectionId, videoOrders, videoNames) {
  var promises = [];
  // for videos
  var videoCount = videoOrders.length;
  var videoInfoArray =[];

  for (var i = 0; i < videoCount; i++) {
    var videoInfo = {};

    videoOrders[i] =  mediaTokenHelper.getVideoId(videoOrders[i].value)[0];
    videoInfo.id = videoOrders[i];

    videoInfo.sequence = i ;
    videoInfo.videoName = videoNames[i].value;

    var nextId = -1;
    if (i < videoCount - 1) {
      nextId =  mediaTokenHelper.getVideoId(videoOrders[i+ 1].value)[0];
    };
    videoInfo.nextId = nextId ;
    videoInfoArray.push(videoInfo);
  }

  videoInfoArray.forEach(function(videoInfo){
    var deferred = Q.defer();

    Video.findOne({id: videoInfo.id})
      .then(function (video) {
        console.dir(video);

        video.name = videoInfo.videoName;
        video.sequence = videoInfo.sequence;
        video.nextid = videoInfo.nextId;
        video.save();

        deferred.resolve(video);
      });
    promises.push(deferred.promise);
  })

  return Q.all(promises);
};

var updateCourseSectionVideoInfo = function (courseInfo, courseId, sectionId) {

  return updateCourseInfo(
    courseId,
    courseInfo.courseName,
    courseInfo.courseDescription,
    courseInfo.courseLevel,
    courseInfo.courseTags
  ).then(function(data){
      console.log("update course info finished");
    })
    .then(function(data) {
      updateCourseSectionInfo(courseId, sectionId,
        courseInfo.sectionName,
        courseInfo.sectionDescription,
        courseInfo.sectionTags
      ).then(function(data){
          console.log("update course section finished");
          return updateVideoInfo(courseId, sectionId, courseInfo.videoOrders, courseInfo.videoNames);
        }) ;
    }
   );
};

var updateSectionVideoInfo = function (sectionInfo, courseId, sectionId) {

  return updateCourseSectionInfo(courseId, sectionId,
    sectionInfo.sectionName,
    sectionInfo.sectionDescription,
    sectionInfo.sectionTags
      ).then(function(data){
          console.log("update course section finished");
          console.dir(data);
          return updateVideoInfo(courseId, sectionId, sectionInfo.videoOrders, sectionInfo.videoNames);
        }) ;
};

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
var getCourseById = function(courseId){
  var defer = Q.defer();
  Course.findOne({id:courseId}).exec(function(err, course){
    if(!!err){
      defer.reject(new Error(err));
    }
    else {
      userRepository.getUserById(course.tutorid).then(function(tutor){
        course.tutor = tutor;
        CourseSection.find({courseid:course.id}).then(function(sections){
          course.sections = sections;
          defer.resolve(course);
        })
      });
    }
  });
  return defer.promise;
};

var updateCourseById = function (courseId, courseInfo) {
  var defer = Q.defer();
  Course.findOne({id:courseId}).then(function(course){
    course.name = courseInfo.name;
    course.desc = courseInfo.desc;
    course.level = courseInfo.level;
    course.coursetype = courseInfo.courseType;
    //course.save(function (err) {deferred.resolve();});
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
}

module.exports = {
  // return all course information, like course info, section info, video info, by course Id
  getCourseSectionInfo: getCourseSectionInfo,

  saveOrUpdateAllCourse: updateCourseSectionVideoInfo,

  saveOrUpdateAllSection :updateSectionVideoInfo,

  getCourseByTutor:getCourseByTutor,

  getCourseById:getCourseById,

  updateCourseById: updateCourseById
}
