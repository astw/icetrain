/**
 * Created by Administrator on 24/05/2015.
 */

  'use strict';

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


module.exports = {
  upload: function (req, res) {
    var files = req.file;



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
    uploader.post(req, res, function (obj) {
      console.log(req.body);
      res.send(JSON.stringify(obj));
    });

    console.log(files);
    console.log(files.name);
    console.log(files.type);
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
