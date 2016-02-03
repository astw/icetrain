/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getfiles: function(req,res) {

    var id = req.param('fileId');

    MediaFile.findOne({id: id})
      .then(function (file) {
        console.log(file);
        if(!file){
          return res.notFound();
        }
        console.log(file);
        var base64Image = file.imageData;
        var img = new Buffer(base64Image, 'base64');

        console.log(img.length / 1024);
        res.writeHead({
          "Content-Type": 'image/png',
          "Content-Length": img.length
        });

        res.end(img);
      },
      function (err) {
        res.serverError(err);
      })
  },

  upload: function  (req, res) {
    if(req.method === 'GET')
      return res.json({'status':'GET not allowed'});
      //	Call to /upload via GET is error

    var uploadFile = req.file('uploadFile');
    console.log(uploadFile);

    uploadFile.upload(function onUploadComplete (err, files) {
      //	Files will be uploaded to .tmp/uploads
      if (err) return res.serverError(err);

      var tutorId = req.params.tutorId;
      var courseId = req.params.courseId;
      var sectionId = req.params.moduleId;

      var folder = createMediaFolder(tutorId, courseId);

      console.log(files);
      res.json({status:200,file:files});
    });
  }
};

