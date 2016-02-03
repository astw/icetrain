var fs = require('fs');
var q = require('q');

module.exports = {
  saveToMediaCollection : saveToMediaCollection
};

function saveToMediaCollection(filePath,tag,owner, fileSize,width, height, category, contentType, mediaFileId) {
  var deferred = q.defer();

  var fileParam = {};

  fileParam.tag = tag;
  fileParam.owner = owner;
  fileParam.width = width;
  fileParam.height = height;
  fileParam.fileSize = fileSize;
  fileParam.category = category;
  fileParam.contentType = contentType;
  fileParam.mediaFile = mediaFileId;

  /// get the thumb media data
  getMediaFileData(filePath, mediaFileId)
    .then(function (data) {
      fileParam.data = data;
      Media.create(fileParam, function (err, mediaCreated) {
        if (err) {
           return deferred.reject(err);
        }
        return deferred.resolve(mediaCreated);
      });
    });

  return deferred.promise;
}

 function  getMediaFileData(filePath, mediaFileId){
   var defer = q.defer();
   if(!mediaFileId){
     defer.resolve(null);
   }

   fs.readFile(filePath, 'binary', function (err, data) {
     if (err) {
       return defer.resolve(null);
     }

     var base64Image = new Buffer(data, 'binary').toString('base64');
     return defer.resolve(base64Image);
   });

   return defer.promise;
 }
