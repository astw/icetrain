/**
 * FancyUploadController
 *
 * @description :: Server-side logic for managing fancyuploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//
var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path=require("path");
var randomstring = require("randomstring");

var changeFilesName = function(obj){
    obj.files.forEach(function(file){
        var fileExtension = path.extname(file.name);
        var fileName = file.name.substring(0,file.name.indexOf('.') -1);

        var oldname = path.join(options.uploadDir, file.name);
        var newame =   randomstring.generate() + fileExtension;
        fs.rename(oldname, path.join(options.uploadDir, newame), function(err){
            if(err){
                throw err;
            }

            obj.deleteUrl = path.join(options.uploadUrl, newame);
            obj.name = newame;
            obj.url = obj.deleteUrl;
        });
    });
};

var createUploader= function(req) {

    if (options.uploadDir.indexOf(req.session.id) < 0) {
        var dir = path.join(options.uploadDir, req.session.id);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };

        dir = dir.replace(/\\/g,"/");
        options.uploadDir = dir;
        options.tmpDir = dir;
        options.public = dir;
        options.uploadUrl = path.join(options.uploadUrl, req.session.id, "/").replace(/\\/g,"/");
    }
    var uploader = require('blueimp-file-upload-expressjs')(options);
    return uploader;
};

module.exports = {

    delete:function(req, res){

        var uploader = createUploader(req);
		uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    },

	upload: function  (req, res) {

        if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});
        console.log(req.body);
        console.log(req.files);
        var uploader = createUploader(req);
        console.log("begin uploading....");
        uploader.post(req, res, function (obj) {
            console.log(req.body);
            res.send(JSON.stringify(obj));

            console.log(JSON.stringify(obj));
//            Video.create({
//
//            })
        });
    }
};

