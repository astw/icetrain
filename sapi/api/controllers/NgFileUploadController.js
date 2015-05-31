/**
 * Created by Administrator on 24/05/2015.
 */

var formidable = require('formidable');

var videoOptions = require("./settings/videoFileSettings.js").options;
var util = require('util');
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
var inspect = require('util').inspect; ;

var tokenHelper = require("../services/tokenHelper.js");

var createUploader2 = function (req, dir) {
  dir = dir.replace(/\\/g, "/");
  options.uploadDir = dir;
  options.tmpDir = dir;
  options.public = dir;
  var uploader = require('blueimp-file-upload-expressjs')(options);
  return uploader;
};

var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path = require("path")
var root = require('app-root-path') + "";
var Ffmpeg = require('fluent-ffmpeg');

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

var processVideoUploading = function (req, res,mediaFormData, moduleId, courseId, tutorId, videoFilePath) {
  Ffmpeg.ffprobe(videoFilePath, function (err, metadata) {
    var duration = 0;
    metadata.streams.forEach(function (mediaInfo) {
      if (mediaInfo.codec_type == "video") {
        duration = mediaInfo.duration;
        return;
      }
    });

    console.log('videoname=' + mediaFormData.videoname);
    var relativeVideoPath = videoFilePath.replace(root,"");
    Video.create(
      {
        name: mediaFormData.videoname || "  ",
        tutor: {id:tutorId},
        course:{id:courseId},
        module:{id:moduleId},
        size: mediaFormData.filesize,
        format: mediaFormData.filetype,
        duration: duration,
        path: relativeVideoPath
      },
      function (err, data) {
        if (!!err) {
          console.log(JSON.stringify(err));
        }

        var ids = [tutorId, courseId, moduleId, data.id];
        var idToken = courseHashids.encode(ids);
        mediaFormData.urltoken = idToken;

        data.urltoken = mediaFormData.urltoken;
        data.save(function(err){
          if(err){}
          else
            res.send(data);
        });
      })
  });
};
module.exports = {
  upload: function (req, res) {

    var uploadFile = req.file('uploadFile');
    console.log(req.body.data);

    uploadFile.upload(function onUploadComplete(err, files) {
      //	Files will be uploaded to .tmp/uploads
      if (err) return res.serverError(err);

      var tutorId = parseInt( req.params.tutorId);
      var courseId = parseInt(req.params.courseId);
      var moduleId = parseInt(req.params.moduleId);

      var folder = createMediaFolder(tutorId, courseId);
      var formObj = {};
      formObj.filesize = files[0].size;
      formObj.filename = files[0].filename;
      formObj.filetype = files[0].type;
      console.log(req.body.data)
      if(req.body.data){

        formObj.videoname = JSON.parse(req.body.data).videoname;
      }
      else
        formObj.videoname = '';

      var filepath = formObj.path = files[0].fd;

      if(formObj.filetype == 'video/mp4'){
        processVideoUploading(req,res,formObj,moduleId, courseId, tutorId, filepath);
      }else{
        res.json({status: 401,Error:"not supported"});
      }
    })
  }
};


