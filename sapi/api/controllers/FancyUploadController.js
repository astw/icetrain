/**
 * FancyUploadController
 *
 * @description :: Server-side logic for managing fancyuploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//
var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path = require("path")
var root = require('app-root-path') + "";

var randomstring = require("randomstring");

var courseidKey = "sec for construct course id";
var sectionKey = "sec for construct couse section id";
var Hashids = require("hashids"),
  courseHashids = new Hashids(courseidKey),
  sectionHashids = new Hashids(sectionKey);
var urlQuery = require('url');
var flash = require('connect-flash');

var Busboy = require("busboy");
var inspect = require('util').inspect;
var formidable = require('formidable');


var changeFilesName = function (obj) {
  obj.files.forEach(function (file) {
    var fileExtension = path.extname(file.name);
    var fileName = file.name.substring(0, file.name.indexOf('.') - 1);

    var oldname = path.join(options.uploadDir, file.name);
    var newame = randomstring.generate() + fileExtension;
    fs.rename(oldname, path.join(options.uploadDir, newame), function (err) {
      if (err) {
        throw err;
      }

      obj.deleteUrl = path.join(options.uploadUrl, newame);
      obj.name = newame;
      obj.url = obj.deleteUrl;
    });
  });
};

var createUploader = function (req) {

  if (options.uploadDir.indexOf(req.session.id) < 0) {
    var dir = path.join(options.uploadDir, req.session.id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    ;

    dir = dir.replace(/\\/g, "/");
    options.uploadDir = dir;
    options.tmpDir = dir;
    options.public = dir;
    options.uploadUrl = path.join(options.uploadUrl, req.session.id, "/").replace(/\\/g, "/");
  }
  var uploader = require('blueimp-file-upload-expressjs')(options);
  return uploader;
};

var createUploader2 = function (req, dir) {

  dir = dir.replace(/\\/g, "/");
  options.uploadDir = dir;
  options.tmpDir = dir;
  options.public = dir;
  var uploader = require('blueimp-file-upload-expressjs')(options);
  return uploader;
};

var createFolder = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  ;
};

var createMediaFolder = function (tutorId, courseId) {

  var tutorFolder = path.join(root, "media/tutors/", tutorId + "");
  var tutorCoursesFolder = path.join(tutorFolder, "/courses/");
  var courseFolder = path.join(tutorCoursesFolder, courseId + "");
  var originFolder = path.join(courseFolder, "/origin");
  createFolder(tutorFolder);
  createFolder(tutorCoursesFolder);
  createFolder(courseFolder);
  createFolder(originFolder);

  return originFolder;
};

module.exports = {
  delete: function (req, res) {

    var uploader = createUploader(req);
    uploader.delete(req, res, function (obj) {
      res.send(JSON.stringify(obj));
    });
  },

  upload: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    var uploader = createUploader(req);
    console.log("begin uploading....");
    uploader.post(req, res, function (obj) {
      console.log(req.body);
      res.send(JSON.stringify(obj));
    });
  },

  uploadCourseVideo: function (req, res) {
    //var couseToken = req.param.courseid;  //urlQuery.parse(req.url, true).query.courseid;
    //var sectionToken = req.param.sectionid;  //urlQuery.parse(req.url, true).query.sectionid;
    var token = req.params.courseToken;
    var ids = courseHashids.decode(token);
    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];

    var folder = createMediaFolder(tutorId, courseId);
    var uploader = createUploader2(req, folder);
    console.log("begin uploading....");
    uploader.post(req, res, function (obj) {
      console.log(req.body);
      Video.create(
        {
          name: obj.name || "  ",
          tutorid: tutorId,
          courseid: courseId,
          sectionid: sectionId,
          size: obj.files[0].size,
          format: obj.files[0].type,
          duration: 101,
          path: path.join(folder,obj.files[0].name)
        },
        function (err, data) {
          if (!!err) {
            console.log(JSON.stringify(err));
          }

          var ids = [tutorId, courseId, sectionId, data.id];
          var idToken = courseHashids.encode(ids);
          obj.url = "/delete-video/" + idToken;
          obj.deleteurl = obj.url;
          obj.files[0].deleteUrl = obj.url;
          obj.files[0].url = obj.url;

          data.url = obj.url;
          Video.update(data);
          ///delete-video
          res.send(JSON.stringify(obj));
        })
    });
  },

  deleteCourseVideo: function (req, res) {

    var token = req.params.videoToken;
    var ids = courseHashids.decode(token);
    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];
    var videoId = ids[3];

    Video.findOne({id: videoId}, function (err, video) {
      var videoPath ="" ;// path.join(root, video.path);
      var uploader = createUploader2(req, videoPath);
      uploader.delete(req, res, function (obj) {
        // delete data in database
        // delete  the duration time from section and course tables
        CourseSection.findOne({id: sectionId}, function (err, section) {
          section.duration -= video.duration;
          section.save();
          Course.findOne({id: courseId}, function (err, course) {
            course.duration -= video.duration;
            course.save();
          });
        });
        res.send(JSON.stringify(obj));

      });
    });
  },

  showUploadUI: function (req, res) {
    var courseToken = req.params.courseToken;
    req.flash("courseInfoToken", courseToken);
    res.view("section-video-upload", {courseToken: courseToken});
  }
};
