
var formidable = require('formidable');

var videoOptions = require("./settings/videoFileSettings.js").options;
var util = require('util');
var fs = require('fs');
var path = require("path");
var root = require('app-root-path') + "";
var jimp = require('jimp');
var q = require('q');

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

var getImageFolder = function (imageType,size) {
    return path.join(root, 'media','images',size, imageType);
};

var processImageUploading = function (req, res,mediaFormData,filePath) {

  var filePath = filePath.replace(root, "");

  Image.create(
    {
      tag: mediaFormData.tag,
      size: mediaFormData.filesize,
      format: mediaFormData.filetype,
      category:mediaFormData.category,
      owner:mediaFormData.owner,
      width:mediaFormData.width,
      height:mediaFormData.height,
      path: filePath
    },
    function (err, data) {
      if (!!err) {
        console.log('error in upload image' + err);
        console.log(JSON.stringify(err));
      }
      // get width and height values
      //
      data.save(function (err) {
        if (err) {
          return res.serverError(err);
        }
        else
           return res.ok(data);
      });
    });
};

var saveThumb = function(origFilePath,targetThumbFile, imageType) {

  var defer = q.defer();

  // for background,  the width/height=4:3  (68:51)
  // for props, the width/height=68 :x
  // for text,  the width/height=150 :x

  var originSize = {};

  jimp.read(origFilePath)
    .then(function (image) {
      originSize.width = image.bitmap.width;
      originSize.height = image.bitmap.height;

      defer.resolve(originSize);

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

      imageBuff.write(targetThumbFile, function(){

      });

    });

  return defer.promise;
};

var uploadImage = function(req,res) {

  var uploadFile = req.file('uploadFile');
  var uploadOptions = {
    maxBytes: 100000000
  };

  var owner = req.body.data.user;
  owner = 1;
  var imageType = req.param('cat') || 'props';
  var fullSizeFolder = getImageFolder(imageType, 'fullsize');
  var thumbFolder = getImageFolder(imageType, 'thumb');

  var data = JSON.parse(req.body.data);
  var tag = data.tag;

  uploadFile.upload(uploadOptions, function onUploadComplete(err, files) {
    var formObj = {};
    formObj.filesize = files[0].size;
    formObj.filename = files[0].filename;
    formObj.filetype = files[0].type;
    formObj.category = imageType;   // background, props text
    formObj.owner = owner;
    formObj.tag = tag;

    var filepath = formObj.path = files[0].fd;
    var baseFileName = path.basename(filepath);
    var extname = path.extname(filepath);
    var targetfile = path.join(fullSizeFolder, baseFileName);
    var targetThumbFile = path.join(thumbFolder, baseFileName);

    fs.createReadStream(filepath).pipe(fs.createWriteStream(targetfile));

    //save thumb file
    saveThumb(filepath, targetThumbFile, imageType)
      .then(function (originSize) {

        formObj.width = originSize.width;
        formObj.height = originSize.height;

        //if(formObj.filetype == 'video/mp4' || formObj.filetype == 'video/webm'){
        processImageUploading(req, res, formObj, baseFileName);
      })
  })
};

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



