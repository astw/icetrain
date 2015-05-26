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
var Ffmpeg = require('fluent-ffmpeg');


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

var tokenHelper = require("../services/tokenHelper.js");



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
    };

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

var processVideoUploading = function (req, res,mediaFormData, sectionId, courseId, tutorId, videoFilePath) {
  Ffmpeg.ffprobe(videoFilePath, function (err, metadata) {
    console.dir(metadata);
    var duration = 0;
    metadata.streams.forEach(function (mediaInfo) {
      if (mediaInfo.codec_type == "video") {
        duration = mediaInfo.duration;
        return;
      }
    });

    var relativeVideoPath = videoFilePath.replace(root,"");
    Video.create(
      {
        name: mediaFormData.name || "  ",
        tutorid: tutorId,
        courseid: courseId,
        sectionid: sectionId,
        size: mediaFormData.files[0].size,
        format: mediaFormData.files[0].type,
        duration: duration,
        path: relativeVideoPath
      },
      function (err, data) {
        if (!!err) {
          console.log(JSON.stringify(err));
        }

        var ids = [tutorId, courseId, sectionId, data.id];
        var idToken = courseHashids.encode(ids);
        mediaFormData.url = "/delete-video/" + idToken;
        mediaFormData.deleteurl = mediaFormData.url;
        mediaFormData.files[0].deleteUrl = mediaFormData.url;
        mediaFormData.files[0].url = mediaFormData.url;

        data.url = mediaFormData.url;
        Video.update(data);

        res.send(JSON.stringify(mediaFormData));
      })
  });
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


    //var form = new formidable.IncomingForm();
    //form.uploadDir = "f:\\temp";
    //form.encoding ='binary';
    //form.addListener('file',function(name, file){
    //  console.log(name);
    //  console.log(file);
    //})
    //
    //form.addListener('end', function() {
    //  res.end();
    //});
    //
    //form.parse(req, function(err, fields, files) {
    //  if (err) {
    //    console.log(err);
    //  }
    //});

    var uploader = createUploader(req);
    console.log("begin uploading....");
    uploader.post(req, res, function (obj) {
      console.log(req.body);
      // delete data from db
      // reduce the duration from courseSection and course tables

      res.send(JSON.stringify(obj));
    });
  },

  uploadCourseVideo: function (req, res) {

    var token = req.params.token;
    // var ids = courseHashids.decode(token);
    var ids = tokenHelper.getSectionId(token);

    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2];

    var folder = createMediaFolder(tutorId, courseId);
    var uploader = createUploader2(req, folder);
    console.log("begin uploading....");
    uploader.post(req, res, function (obj) {
      console.dir(req.body);

      var videoFilePath = path.join(folder, obj.files[0].name);
      if (obj.files[0].type == "video/mp4") {
        processVideoUploading(req, res, obj, sectionId, courseId, tutorId, videoFilePath);
      }
      else{
        res.send(JSON.stringify(obj));
      }
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
      var videoPath = "";// path.join(root, video.path);
      var uploader = createUploader2(req, videoPath);
      uploader.delete(req, res, function (obj) {
        // delete data in database
        // delete  the duration time from section and course tables
        CourseSection.findOne({id: sectionId}, function (err, section) {
          if(!!section) {
            section.duration -= video.duration;
            section.save();
            Course.findOne({id: courseId}, function (err, course) {
              course.duration -= video.duration;
              course.save();
            });
          }
        });
        res.send(JSON.stringify(obj));

      });
    });
  },

  showUploadUI: function (req, res) {
    var token = req.params.token;
    var ids = tokenHelper.getSectionId(token);
    //[tutorId, courseId, data.id]
    var tutorId = ids[0];
    var courseId = ids[1];
    var sectionId = ids[2] ;

    var courseToken = tokenHelper.getCourseToken([courseId, tutorId]);
    var sectionToken = tokenHelper.getSectionToken(sectionId);

    req.flash("courseInfoToken", token);
    res.view("section-video-upload", {token: token, courseToken:courseToken, sectionToken:sectionToken, tutorId: tutorId});
  }
};
