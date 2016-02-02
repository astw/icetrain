//
//var formidable = require('formidable');
//
//var videoOptions = require("./settings/videoFileSettings.js").options;
//var util = require('util');
//var fs = require('fs');
//var path = require("path");
//var root = require('app-root-path') + "";
//var jimp = require('jimp');
//var q = require('q');
//
//var extend = require('util')._extend;
//
//var randomstring = require("randomstring");
//var courseidKey = "sec for construct course id";
//var sectionKey = "sec for construct couse section id";
//var Hashids = require("hashids");
//
//var urlQuery = require('url');
//var flash = require('connect-flash');
//
//var Busboy = require("busboy");
//var inspect = require('util').inspect; ;
//
//var tokenHelper = require("../services/tokenHelper.js");
//var options = require("./settings/jqueryFileSetting.js").options;
//
//var fs = require('fs');
//var path = require("path")
//var root = require('app-root-path') + "";
//
//var getImageFolder = function (imageType,size) {
//    return path.join(root, 'media','images',size, imageType);
//};
//
//var processImageUploading = function (req, res,mediaFormData,filePath) {
//
//  var filePath = filePath.replace(root, "");
//
//  Image.create(
//    {
//      tag: mediaFormData.tag,
//      size: mediaFormData.filesize,
//      format: mediaFormData.filetype,
//      category:mediaFormData.category,
//      owner:mediaFormData.owner,
//      width:mediaFormData.width,
//      height:mediaFormData.height,
//      path: filePath
//    },
//    function (err, data) {
//      if (!!err) {
//        console.log('error in upload image' + err);
//        console.log(JSON.stringify(err));
//      }
//      // get width and height values
//      //
//      data.save(function (err){
//
//        if (err) {
//          return res.serverError(err);
//        }
//        else
//           return res.ok(data);
//      });
//    });
//};
//
//var saveThumb = function(origFilePath,targetThumbFile, imageType) {
//
//  var defer = q.defer();
//
//  // for background,  the width/height=4:3  (68:51)
//  // for props, the width/height=68 :x
//  // for text,  the width/height=150 :x
//
//  var originSize = {};
//
//  jimp.read(origFilePath)
//    .then(function (image) {
//      originSize.width = image.bitmap.width;
//      originSize.height = image.bitmap.height;
//
//      defer.resolve(originSize);
//
//      var targetWidth = 68;
//      var targetHeight = 51;
//
//
//      var imageBuff;
//      if (imageType === 'background') {
//        imageBuff = image.resize(targetWidth, targetHeight)
//      } else if (imageType === 'props') {
//        imageBuff = image.resize(68, jimp.AUTO)
//      } else {
//        imageBuff = image.resize(150, jimp.AUTO)
//      }
//
//      imageBuff.write(targetThumbFile, function(){
//
//      });
//    });
//
//  return defer.promise;
//};
//
//function saveThumb(category){
//  if(category ==='background' ||
//    category ==='props' ||
//    category ==='text'
//    )
//    return true;
//
//   return false;
//}
//
//function saveToImage(image){
//  var deferred = Q.defer;
//
//  Image.create(image, function (err, data) {
//      if (!!err) {
//         return deferred.reject(err);
//      }
//     return deferred.resolve(data);
//    });
//
//  return deferred.promise;
//}
//
//function saveToFile(fileData){
//  var deferred = Q.defer;
//
//  File.create(image, function (err, data) {
//    if (!!err) {
//      return deferred.reject(err);
//    }
//    return deferred.resolve(data);
//  });
//
//  return deferred.promise;
//}
//
//var saveToDB = function(formObj) {
//
//  //origFilePath, filename, imageType
//  var defer = q.defer();
//  var originSize = {}
//
//  jimp.read(formObj.originPath)
//    .then(function (image) {
//
//      originSize.width = image.bitmap.width;
//      originSize.height = image.bitmap.height;
//
//
//
//      defer.resolve(originSize);
//
//      fs.readFile(formObj.origFilePath, 'binary', function(err,data){
//        if(err) throw err;
//
//        var base64Image = new Buffer(data, 'binary').toString('base64');
//
//        var fileParam = extend(originSize,formObj,{imageData:base64Image});
//
//        console.log('file param:', fileParam);
//        delete fileParam.originPath;
//
//        // step 1,  save all information to Image collection
//        saveToImage(fileParam)
//          .then(function(succeed){
//             // save to File collection the origin image file data;
//
//
//
//            fileParam.category = 'thumb';
//            fileParam.fileSize = resizedImage.bitmap.data.length;
//            fileParam.width=resizedImage.bitmap.width;
//            fileParam.height=resizedImage.bitmap.heigh;
//            fileParam.imageData = resizedImage.bitmap.data;
//
//            return saveToFile()
//
//
//          })
//          .catch(function(err){
//            return defer.reject(err);
//          })
//
//        File.create( fileParam)
//          .then(function (file) {
//            console.log('save to db good');
//            defer.resolve(file);
//
//            // only background, props, text  save thumb
//            // font images don't save thumb
//            if(saveThumb(fileParam.category)){
//
//
//
//
//
//
//            return File.create({
//              fileName: filename,
//              cat: 'thumb',
//              fileType: imageType,
//              size: resizedImage.bitmap.data.length,
//
//              imageData: resizedImage.bitmap.data
//            })
//          },
//          function (err) {
//            console.log('save to db fails', err);
//          });
//
//          }
//    });
//
//
//      ///// save into db
//      //File.create({
//      //  fileName: filename,
//      //  cat: 'fullsize',
//      //  fileType: imageType,
//      //  size: image.bitmap.data.length,
//      //  width: originSize.width,
//      //  height: originSize.height,
//      //  imageData: image.bitmap.data
//      //})
//        //.then(function (data) {
//        //  console.log('save to db good,', data);
//        //
//        //  console.log('save to thumb');
//        //
//        //  var targetWidth = 68;
//        //  var targetHeight = 51;
//        //
//        //  var resizedImage;
//        //  if (imageType === 'background') {
//        //    resizedImage = image.resize(targetWidth, targetHeight)
//        //  } else if (imageType === 'props') {
//        //    resizedImage = image.resize(68, jimp.AUTO)
//        //  } else {
//        //    resizedImage = image.resize(150, jimp.AUTO)
//        //  }
//        //
//        //  return File.create({
//        //    fileName: filename,
//        //    cat: 'thumb',
//        //    fileType: imageType,
//        //    size: resizedImage.bitmap.data.length,
//        //    width: resizedImage.bitmap.width,
//        //    height: resizedImage.bitmap.heigh,
//        //    imageData: resizedImage.bitmap.data
//        //  })
//        //},
//        //function (err) {
//        //  console.log('save to db fails', err);
//        //});
//
//      return defer.promise;
//    })
//}
//
//var uploadImage = function(req,res) {
//
//  var uploadFile = req.file('uploadFile');
//  var uploadOptions = {
//    maxBytes: 100000000
//  };
//
//  var owner = req.body.data.user;
//  owner = 1;
//  var imageType = req.param('cat') || 'props';
//  var fullSizeFolder = getImageFolder(imageType, 'fullsize');
//  var thumbFolder = getImageFolder(imageType, 'thumb');
//
//  var data = JSON.parse(req.body.data);
//  var tag = data.tag;
//
//  //File.create({
//  //  fileName: 'filename',
//  //  cat: 'fullsize',
//  //  size: 100
//  //})
//  //  .then(function (data) {
//  //    console.log('save to db good,', data);
//  //  },
//  //
//  //  function (err) {
//  //    console.log('save to db fails', err);
//  //  }
//  //);
//
//
//  uploadFile.upload(uploadOptions, function onUploadComplete(err, files) {
//    var formObj = {};
//    formObj.filesize = files[0].size;
//    formObj.filename = files[0].filename;
//    formObj.category = imageType;   // background, props text
//    formObj.owner = owner;
//    formObj.tag = tag;
//    formObj.contentType = files[0].type;
//    formObj.fileSize = files[0].size/1024;
//    formObj.baseFileName = path.basename(files[0].fd) ;
//    formObj.originPath = files[0].fd;
//
//    // var filepath = formObj.path = files[0].fd;
//    // var baseFileName = path.basename(filepath);
//    // var extname = path.extname(filepath);
//    // var targetfile = path.join(fullSizeFolder, baseFileName);
//    // var targetThumbFile = path.join(thumbFolder, baseFileName);
//
//    // fs.createReadStream(filepath).pipe(fs.createWriteStream(targetfile));
//
//    // console.log(files[0]);
//
//    saveToDB(formObj);
//
//    // remove the temporary file
//    //fs.unlink(filepath);
//
//    ////save thumb file
//    //saveThumb(filepath, targetThumbFile, imageType)
//    //  .then(function (originSize) {
//    //
//    //    formObj.width = originSize.width;
//    //    formObj.height = originSize.height;
//    //
//    //    // delete the origin file in temporary folder
//    //    fs.unlink(filepath);
//    //
//    //    //if(formObj.filetype == 'video/mp4' || formObj.filetype == 'video/webm'){
//    //    processImageUploading(req, res, formObj, baseFileName);
//    //  })
//  })
//};
//
//var deleteImage = function(req, res) {
//  if (req.method != 'DELETE')
//    return res.json({'status': 'GET not allowed'});
//
//  var imageId = req.params('imageId');
//  var id = tokenHelper.getImageId(imageId);
//
//  if (!id) {
//    return res.json({status: 401, Error: 'Unauthorized operation'});
//  }
//
//  Image.destroy({id: id}).exec(function (err, image) {
//    if (err) {
//      return res.json({status: 404, Error: 'Not found'});
//    }
//    return res.json({status: 200, image: image});
//  });
//};
//
//var deleteAllImage = function(req,res){
//  Image.destroy().exec(function (err, images) {
//    if (err) {
//      return res.json({status: 404, Error: 'Not found one to delete'});
//    }
//    images.forEach(function(image){
//      //delete fullsize image
//      var fullSizeFilePath = path.join(root,'media','images','fullsize',image.category, image.path);
//
//      //delete thumb image
//      var thumbFilePath = path.join(root,'media','images','thumb',image.category, image.path);
//      fs.unlink(thumbFilePath);
//    });
//    return res.json('all deleted');
//  });
//};
//
//module.exports = {
//  upload: uploadImage,
//  deleteImage : deleteImage,
//  deleteAllImage: deleteAllImage
//};
//
//
//
