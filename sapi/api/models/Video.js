/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var mediaTokenHelper = require("../services/tokenHelper.js");
var tools = require("../services/common/tools.js");

module.exports = {

  attributes: {

    name: {
      type: "string",
      required: true,
      defaultsTo: ""
    },

    format: {
      type: "string"
    },

    duration: {
      type: "integer",
      required: true,
      defaultsTo: -1
    },

    size: {
      type: "integer"
    },

    path: {
      type: "string",
      required: true
    },

    urltoken: {
      type: "string",
      defaultsTo: ""
    },

    module: {
      model: "Module"
    },

    tutor: {
      model: "User"
    },

    next: {
      model: "Video"
    },

    toJSON: function () {
      var obj = this.toObject();
      obj.id = mediaTokenHelper.createVideoToken(obj.id, obj.path);
      return obj;
    },

    playtoken: function () {
      var obj = this.toObject();
      return mediaTokenHelper.createVideoToken(obj.id, obj.path);
    },

    enId: function () {
      var obj = this.toObject();
      return mediaTokenHelper.getVideoToken(obj.id);
    }
  },

  beforeCreate: function (values, next) {
    // increase the module duration, and course duration
    // step 1 findout module

    Module.findOne({id: values.module}, function (err, module) {
      if (!!err) {
        console.log("no module found");
      } else {
        if (!!module) {
          module.duration += values.duration || 0;
          module.save();

          // step 2 find course
          Course.findOne({id: module.course}, function (err, course) {
            if (!!err) {
              console.log("no course found");
            }
            else {
              if (!!course) {
                course.duration += values.duration || 0;
                course.save();
              }
            }
          });
        }
      }
    });

    next();
  },
  //
  //afterDestroy: function (attribute, next) {
  //
  //  Video.findOne({urltoken: attribute.where.urltoken}).then(function (video) {
  //    if(video.duration > 0 ){
  //    // decrease the section duration, and course duration
  //    Module.findOne({id: attribute.where.moduleId}, function (err, module) {
  //      if (!!err) {
  //        console.log("no module found");
  //      } else {
  //        if (!!module) {
  //          module.duration -= attribute.duration || 0;
  //          module.save();
  //        }
  //      }
  //    });
  //
  //    // step 2 find course
  //    Course.findOne({id: attribute.where.courseId}, function (err, course) {
  //      if (!!err) {
  //        console.log("no course found");
  //      }
  //      else {
  //        if (!!course) {
  //          course.duration -= video.duration || 0;
  //          course.save();
  //        }
  //      }
  //    });
  //  }
  //  });
  //  next();
  //},

  formattedTime: function () {
    var obj = this.toObject();
    var value = obj.duration;
    return tools.formattedTime(value);
  },

  seedData: [
    //{
    //  "name": "linux start",
    //  "tutorid": "1",
    //  "courseid":"1",
    //  "sectionid":"1",
    //  "format": "mp4",
    //  "duration": "130",
    //  "path": "/media/tutors/1/courses/1/hres/m1-s1.mp4",
    //  "id": 1,
    //  "sequence":0,
    //  "nextid":2,
    //  "createdAt": "2014-12-06T21:48:31.816Z",
    //  "updatedAt": "2014-12-06T21:48:31.816Z"
    //},
    //{
    //  "name": "linux start",
    //  "tutorid": "1",
    //  "courseid":"1",
    //  "sectionid":"1",
    //  "format": "mp4",
    //  "duration": "50",
    //  "path": "/media/tutors/1/courses/1/hres/m1-s2.mp4",
    //  "id": 2,
    //  "sequence":1,
    //  "nextid":-1,
    //  "createdAt": "2014-12-06T21:49:08.458Z",
    //  "updatedAt": "2014-12-06T21:49:08.458Z"
    //}
  ]
};

