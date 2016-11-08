
var formidable = require('formidable');

var videoOptions = require("./settings/videoFileSettings.js").options;
var util = require('util');
var fs = require('fs');
var path = require("path");
var root = require('app-root-path') + "";
var jimp = require('jimp');
var q = require('q');

var extend = require('util')._extend;
var randomstring = require("randomstring");
var Hashids = require("hashids");

var flash = require('connect-flash');
var inspect = require('util').inspect;
var tokenHelper = require("../services/tokenHelper.js");
var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path = require("path")
var root = require('app-root-path') + "";

var saveThumbFile = function(origFilePath,targetThumbFile, imageType) {
  var defer = q.defer();

  // for background,  the width/height=4:3  (68:51)
  // for props and profileIcon, the width/height=68 :x
  // for text,  the width/height=150 :x

  var originSize = {};

  jimp.read(origFilePath)
    .then(function (image) {

      // if the image is a font image,  or the image is from a design page,  do not create thumb image
      if(imageType === 'font' || imageType ==='page' ) {
        var mediaFileInfo= {
          originWidth: image.bitmap.width,
          originHeight:image.bitmap.height,
          originFileSize:image.bitmap.length
        };

        defer.resolve(mediaFileInfo);
        return defer.promise;
      }

      originSize.width = image.bitmap.width;
      originSize.height = image.bitmap.height;

      var targetWidth = 68;
      var targetHeight = 51;

      var imageBuff;
      if (imageType === 'background' || imageType === 'bigText') {
        imageBuff = image.resize(targetWidth, targetHeight)
      } else if (imageType === 'props') {
        imageBuff = image.resize(68, jimp.AUTO)
      } else {
        imageBuff = image.resize(150, jimp.AUTO)
      }

      imageBuff.write(targetThumbFile, function(err, data){
         var mediaFileInfo= {
           originWidth:originSize.width,
           originHeight:originSize.height,
           originFileSize:image.bitmap.length,
           thumbWidth:imageBuff.bitmap.width,
           thumbHeight:imageBuff.bitmap.height,
           thumbFileSize:imageBuff.bitmap.length
         };

         return defer.resolve(mediaFileInfo);   // always return succeed
      });
    });

  return defer.promise;
};

var uploadImage = function(req,res) {

  var uploadFile = req.file('uploadFile');
  var uploadOptions = {
    maxBytes: 100000000
  };

  if(req.session.userid == null){
    return res.status(301).send("Not logged");
  } 
console.log('session id=', req.session.userid);
  var owner = req.session.userid ; 
  var imageType = req.param('cat') || 'props';
  

  uploadFile.upload(uploadOptions, function onUploadComplete(err, files) {
    var tag = "";
    var data = req.body.data;
    if(data){
      tag = data.tag;  
    } 

    var category = imageType;
    var contentType = files[0].type;
    var originFilePath = files[0].fd;
    var filePath = path.parse(originFilePath);
    var targetThumbFile = path.join(filePath.dir, filePath.name + "_thumb" + filePath.ext);
    var fileSize = files[0].size;

    saveThumbFile(originFilePath, targetThumbFile, imageType)
      .then(function (thumbMediaInfo) {
        // saveThumb file finished then save to mediaFile table

        var originWidth = thumbMediaInfo.originWidth;
        var originHeight = thumbMediaInfo.originHeight;

        mediaFileRepository.saveToMediaFileCollection(originFilePath, fileSize, originWidth, originHeight, category, contentType)
          .then(function (mediaFileOjbect) {
            return mediaRepository.saveToMediaCollection(targetThumbFile, tag, owner,
              fileSize, originWidth, originHeight, category, contentType, mediaFileOjbect.id);
          }) 
          .then(function (mediaCreated) {
               res.status(201).send(mediaCreated);
             },

             function (err) {
             return res.serverError(err);
          })
          .done(function () {
            fs.unlink(originFilePath);
            fs.unlink(targetThumbFile);
          })
      });
    // save originFile
  })
}

var deleteImage = function(req, res) {
  if (req.method != 'DELETE')
    return res.json({'status': 'GET not allowed'});

  var imageId = req.param('imageId');

  mediaRepository.deleteMedia(imageId)
    .then(
    function (media) {
      if(!media){
        return res.notFound();
      }
      return res.ok(media.length);
    },
   function(){
     res.notFound();
   })
    .catch(function (err) {
      return res.serverError(err);
    })
};

var deleteAllImage = function(req,res){
  Image.destroy().exec(function (err, images) {
    if (err) {
      return res.json({status: 404, Error: 'Not found one to delete'});
    }
    images.forEach(function(image){
      //delete fullsize image
      var fullSizeFilePath = path.join(root,'media','images','fullsize',image.category, image.path);

      //delete thumb image
      var thumbFilePath = path.join(root,'media','images','thumb',image.category, image.path);
      fs.unlink(thumbFilePath);
    });
    return res.json('all deleted');
  });
};

module.exports = {
  upload: uploadImage,
  deleteImage : deleteImage,
  deleteAllImage: deleteAllImage
};
