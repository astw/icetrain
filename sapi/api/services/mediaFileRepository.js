var util = require('util');
var fs = require('fs');
var path = require("path");
var q = require('q');

module.exports = {

  saveToMediaFileCollection : saveToMediaFileCollection

};

function saveToMediaFileCollection(filePath,fileSize,width, height, category, contentType) {
  var deferred = q.defer();

  fs.readFile(filePath, 'binary', function (err, data) {
    if (err) throw err;

    var base64Image = new Buffer(data, 'binary').toString('base64');
    var fileParam = {};

    fileParam.width = width;
    fileParam.height = height;
    fileParam.fileSize = fileSize;
    fileParam.category = category;
    fileParam.contentType = contentType;
    fileParam.imageData = base64Image;

    MediaFile.create(fileParam, function (err, data) {
      return deferred.resolve(data);  // always return true no matter the saving is successfull or not
    });
  });

  return deferred.promise;
}
