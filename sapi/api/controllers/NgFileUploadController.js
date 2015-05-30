/**
 * Created by Administrator on 24/05/2015.
 */

var formidable = require('formidable');

//var NgFileController = function(){};
//NgFileController.prototype.upload = function(req,res){
//  var files = req.files;
//  console.log(files);
//}
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


module.exports = {
  upload: function (req, res) {

    var uploadFile = req.file('uploadFile');
    console.log(uploadFile);
    console.log(req.body.data);

    uploadFile.upload(function onUploadComplete(err, files) {
      //	Files will be uploaded to .tmp/uploads
      if (err) return res.serverError(err);

      var tutorId = req.params.tutorId;
      var courseId = req.params.courseId;
      var sectionId = req.params.moduleId;

      var folder = createMediaFolder(tutorId, courseId);
      console.log(folder);
      console.log(files);
      var filesize = files[0].size;
      var path = files[0].fd;
      var filename = files[0].filename;
      res.json({status: 200, file: files});

    })
  }
}

//
//module.exports = {
//  upload: function  (req, res) {
//    console.log("upload is called");
//    if(req.method === 'GET')
//      return res.json({'status':'GET not allowed'});
//    //	Call to /upload via GET is error
//
//    var uploadFile = req.file('file');
//    console.log(uploadFile);
//
//    uploadFile.upload(function onUploadComplete (err, files) {
//      //	Files will be uploaded to .tmp/uploads
//
//      if (err) return res.serverError(err);
//      //	IF ERROR Return and send 500 error with error
//
//      console.log(files);
//      res.json({status:200,file:files});
//    });
//  }
//};
