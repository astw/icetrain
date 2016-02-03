
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
var courseidKey = "sec for construct course id";
var sectionKey = "sec for construct couse section id";
var Hashids = require("hashids");

var urlQuery = require('url');
var flash = require('connect-flash');

var Busboy = require("busboy");
var inspect = require('util').inspect; ;

var tokenHelper = require("../services/tokenHelper.js");
var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path = require("path")
var root = require('app-root-path') + "";


var saveThumbFile = function(origFilePath,targetThumbFile, imageType) {
  var defer = q.defer();

  // for background,  the width/height=4:3  (68:51)
  // for props, the width/height=68 :x
  // for text,  the width/height=150 :x

  var originSize = {};

  jimp.read(origFilePath)
    .then(function (image) {
      originSize.width = image.bitmap.width;
      originSize.height = image.bitmap.height;

      var targetWidth = 68;
      var targetHeight = 51;

      var imageBuff;
      if (imageType === 'background') {
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
           thumbFileSize:imageBuff.bitmap.length,
           data:data
         };

         return defer.resolve(mediaFileInfo);   // always return succeed
      });
    });

  return defer.promise;
};


var uploadImage = function(req,res) {
  console.log('receiving data');

  var uploadFile = req.file('uploadFile');
  var uploadOptions = {
    maxBytes: 100000000
  };

  var owner = req.body.data.user;
  owner = 1;
  var imageType = req.param('cat') || 'props';

  var data = JSON.parse(req.body.data);
  var tag = data.tag;

  uploadFile.upload(uploadOptions, function onUploadComplete(err, files) {

    var category = imageType;
    var contentType = files[0].type;
    var originFilePath = files[0].fd;
    var filePath = path.parse(originFilePath);
    var targetThumbFile = path.join(filePath.dir, filePath.name + "_thumb" + filePath.ext);

    saveThumbFile(originFilePath, targetThumbFile, imageType)
      .then(function (thumbMediaInfo) {
        // saveThumb file finished then save Image
        var fileSize = thumbMediaInfo.originFileSize;
        var originWidth = thumbMediaInfo.originWidth;
        var originHeight = thumbMediaInfo.originHeight;
        var thumbWidth = thumbMediaInfo.thumbWidth;
        var thumbHeight = thumbMediaInfo.thumbHeight;
        var mediaFileId = thumbMediaInfo.id;
        var thumbMediaData = thumbMediaInfo.data;

        console.log('---- saveThumb return=', thumbMediaInfo);

        mediaFileRepository.saveToMediaFileCollection(originFilePath, fileSize, originWidth, originHeight, category, contentType)
          .then(function (mediaFileOjbect) {

            console.log('---- saveThumb return=', thumbMediaInfo);

            console.log(mediaFileOjbect);

            // mediaFile save finished
            // save Image meta data;
             return mediaRepository.saveToMediaCollection(targetThumbFile, tag, owner,
              fileSize, originWidth, originHeight, category, contentType, mediaFileId);
          });
      });
    // save originFile
  });

  // remove the temporary file
  //fs.unlink(filepath);
  //;
}

var deleteImage = function(req, res) {
  if (req.method != 'DELETE')
    return res.json({'status': 'GET not allowed'});

  var imageId = req.params('imageId');
  var id = tokenHelper.getImageId(imageId);

  if (!id) {
    return res.json({status: 401, Error: 'Unauthorized operation'});
  }

  Image.destroy({id: id}).exec(function (err, image) {
    if (err) {
      return res.json({status: 404, Error: 'Not found'});
    }
    return res.json({status: 200, image: image});
  });
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



