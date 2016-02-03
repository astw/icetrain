var fs = require('fs');

module.exports = {
  saveToMediaCollection : saveToMediaCollection
};

function saveToMediaCollection(filePath,tag,owner, fileSize,width, height, category, contentType, mediaFileId) {
  var deferred = q.defer();

  fs.readFile(filePath, 'binary', function (err, data) {
    if (err) throw err;

    var base64Image = new Buffer(data, 'binary').toString('base64');
    var fileParam = {};

    fileParam.tag =tag;
    fileParam.owner = owner;

    fileParam.width = width;
    fileParam.height = height;
    fileParam.fileSize = fileSize;
    fileParam.category = category;
    fileParam.contentType = contentType;

    fileParam.mediaFileId = mediaFileId;
    fileParam.data = base64Image;

    Media.create(fileParam, function (err, data) {
      return deferred.resolve(data);  // always return true no matter the saving is successfull or not
    });
  });

  return deferred.promise;
}
