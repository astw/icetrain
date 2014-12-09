/**
 * FancyUploadController
 *
 * @description :: Server-side logic for managing fancyuploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//
var options = require("./settings/jqueryFileSetting.js").options;

var fs = require('fs');
var path = require("path")
var root = require('app-root-path') + "";

var randomstring = require("randomstring");

var courseidKey = "sec for construct course id";
var sectionKey = "sec for construct couse section id";
var Hashids = require("hashids"),
    couseHashids = new Hashids(courseidKey),
    sectionHashids = new Hashids(sectionKey);
var urlQuery = require('url');

var changeFilesName = function (obj) {
    obj.files.forEach(function (file) {
        var fileExtension = path.extname(file.name);
        var fileName = file.name.substring(0, file.name.indexOf('.') - 1);

        var oldname = path.join(options.uploadDir, file.name);
        var newame = randomstring.generate() + fileExtension;
        fs.rename(oldname, path.join(options.uploadDir, newame), function (err) {
            if (err) {
                throw err;
            }

            obj.deleteUrl = path.join(options.uploadUrl, newame);
            obj.name = newame;
            obj.url = obj.deleteUrl;
        });
    });
};

var createUploader = function (req) {

    if (options.uploadDir.indexOf(req.session.id) < 0) {
        var dir = path.join(options.uploadDir, req.session.id);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };

        dir = dir.replace(/\\/g, "/");
        options.uploadDir = dir;
        options.tmpDir = dir;
        options.public = dir;
        options.uploadUrl = path.join(options.uploadUrl, req.session.id, "/").replace(/\\/g, "/");
    }
    var uploader = require('blueimp-file-upload-expressjs')(options);
    return uploader;
};

var createUploader2 = function (req, dir) {

    dir = dir.replace(/\\/g, "/");
    options.uploadDir = dir;
    options.tmpDir = dir;
    options.public = dir;
    var uploader = require('blueimp-file-upload-expressjs')(options);
    return uploader;
};

var createFolder = function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    };
};

var createMediaFolder = function (tutorId, courseId) {

    var tutorFolder = path.join(root, "media/tutors/", tutorId);
    var courseFolder = path.join(root, "media/tutors/", tutorId, "/course/" + courseId);
    var originFolder = path.join(root, "media/tutors/", tutorId, "/course/" + courseId + "/origin");
    createFolder(tutorFolder);
    createFolder(courseFolder);
    createFolder(originFolder);

    return originFolder;
};

module.exports = {

    delete: function (req, res) {

        var uploader = createUploader(req);
        uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    },

    upload: function (req, res) {
        if (req.method === 'GET')
            return res.json({'status': 'GET not allowed'});
        console.log(req.body);
        console.log(req.files);
        var uploader = createUploader(req);
        console.log("begin uploading....");
        uploader.post(req, res, function (obj) {
            console.log(req.body);
            res.send(JSON.stringify(obj));
        });
    },

    uploadCourseVideo: function (req, res) {
        var couseToken = req.param.courseid;  //urlQuery.parse(req.url, true).query.courseid;
        var sectionToken = req.param.sectionid;  //urlQuery.parse(req.url, true).query.sectionid;

        var courseId = couseHashids.decode(couseToken)[0];
        var sectionId = sectionHashids.decode(sectionToken)[0];

        var tutor = Course.findOne({id: courseId});

        var folder = createMediaFolder(tutor.id, courseId);

        console.log(req.body);
        console.log(req.files);

        var uploader = createUploader2(req, foler);
        console.log("begin uploading....");
        uploader.post(req, res, function (obj) {
            console.log(req.body);

            res.send(JSON.stringify(obj));
        });
    },

    showUploadUI: function (req, res) {
        var courseToken = req.params.courseid;
        var sectionToken = req.params.sectionid;

        res.view("section-video-upload", {courseid: courseToken, sectionid: sectionToken});
    }
};

