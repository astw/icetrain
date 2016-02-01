/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getfiles: function(req,res){

    File.findOne({fileName:'dff798cb-1632-430c-9976-ad6c42ebdd03.PNG'})
      .then(function(file){
        res.setHeader("Content-Type", 'image/png');
        console.log(file.imageData);
        return res.ok(file.imageData);
        //return res.ok("dd");
      },
    function(err){
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

