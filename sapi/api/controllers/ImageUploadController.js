
var formidable = require('formidable');

var videoOptions = require("./settings/videoFileSettings.js").options;
var util = require('util');
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

var createFolder = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

var getImageFolder = function (imageType) {
    return path.join(root, 'media/images/',imageType);
};

var processImageUploading = function (req, res,mediaFormData,filePath) {

  var filePath = filePath.replace(root, "")
  console.log('---- form', mediaFormData);
  Image.create(
    {
      tag: mediaFormData.tag || "  ",
      size: mediaFormData.filesize,
      format: mediaFormData.filetype,
      category:mediaFormData.category,
      owner:mediaFormData.owner,
      path: filePath
    },
    function (err, data) {
      if (!!err) {
        console.log('error in upload video' + err);
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

var uploadImage = function(req,res){
  console.log('begin upload.....', req.body.data);
  var uploadFile = req.file('uploadFile');
  var uploadOptions = {
     maxBytes:100000000
  };

  var owner = req.body.data.user;
  owner = 1;
  var imageType = req.param('cat') || 'props';
  var folder = getImageFolder(imageType);

  uploadFile.upload(uploadOptions, function onUploadComplete(err, files) {
    var formObj = {};
    formObj.filesize = files[0].size;
    formObj.filename = files[0].filename;
    formObj.filetype = files[0].type;
    formObj.category = imageType;   // background, props text
    formObj.owner = owner;

    var filepath = formObj.path = files[0].fd;
    var baseFileName = path.basename(filepath);
    var extname = path.extname(filepath);
    var targetfile = path.join(folder, baseFileName);
    console.log('===target file', targetfile);

    fs.createReadStream(filepath).pipe(fs.createWriteStream(targetfile));

    //if(formObj.filetype == 'video/mp4' || formObj.filetype == 'video/webm'){
    processImageUploading(req, res, formObj, targetfile);

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
    return res.json({status: 200, Video: video});
  });
};

module.exports = {
  upload: uploadImage,
  deleteImage : deleteImage
};



