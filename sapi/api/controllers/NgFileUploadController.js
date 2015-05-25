/**
 * Created by Administrator on 24/05/2015.
 */

var formidable = require('formidable');

module.exports = {
  upload: function  (req, res) {
    console.log("upload is called");
    if(req.method === 'GET')
      return res.json({'status':'GET not allowed'});
    //	Call to /upload via GET is error

    var form = new formidable.IncomingForm();

    console.log(res);

    var uploadFile = req.file('file');
    console.log(uploadFile);

    uploadFile.upload(function onUploadComplete (err, files) {
      //	Files will be uploaded to .tmp/uploads

      if (err) return res.serverError(err);
      //	IF ERROR Return and send 500 error with error

      console.log(files);
      res.json({status:200,file:files});
    });
  }
};

