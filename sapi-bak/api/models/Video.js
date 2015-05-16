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
    tutorid: {
      type: "string",
      required: true
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

    url: {
      type: "integer"
    },

    courseid: {
      type: "integer",
      required: true,
      defaultsTo: -1
    },

    sectionid: {
       type:"integer",
      required:true,
      defaultsTo:-1
    },

    sequence:{
      type: "integer",
      required: true,
      defaultsTo: -1
    },

    nextid: {
      type: "integer",
      required: true,
      defaultsTo: -1
    },

    toJSON: function () {
      var obj = this.toObject();
      obj.id = mediaTokenHelper.createVideoToken(obj.id, obj.tutorid, obj.path);
      obj.nextid = mediaTokenHelper.createVideoToken(obj.nextid, obj.tutorid, obj.path);
      return obj;
    },
    playtoken:function(){
      var obj = this.toObject();
      return mediaTokenHelper.createVideoToken(obj.id, obj.tutorid, obj.path);
    },
    enId :function(){
      var obj = this.toObject();
      return mediaTokenHelper.getVideoToken(obj.id);
    }
  },

  beforeCreate: function (attribute, next) {
    // increate the section duration, and course duration
    // step 1 findout section
    CourseSection.findOne({id: attribute.sectionid}, function (err, section) {
      if (!!err) {
        console.log("no section found");
      }else {
        if(!!section) {
          section.duration += attribute.duration || 0;
          section.save();
        }
      }
    });

    // step 2 find course
    Course.findOne({id: attribute.courseid}, function (err, course) {
      if(!!err){
        console.log("no course found");
      }
      else {
        if (!!course) {
          course.duration += attribute.duration  || 0;
          course.save();
        }
      }
    });

    next();
  },

  beforeDestroy: function (attribute, next) {
    // increate the section duration, and course duration
    // step 1 findout section
    if(attribute.duration > 0) {
      CourseSection.findOne({id: attribute.sectionid}, function (err, section) {
        if (!!err) {
          console.log("no section found");
        } else {
          section.duration -= attribute.duration || 0;
          section.save();
        }
      });

      // step 2 find course
      Course.findOne({id: attribute.courseid}, function (err, course) {
        if (!!err) {
          console.log("no course found");
        }
        else {
          course.duration -= attribute.duration  || 0;
          course.save();
        }
      });
    }

    next();
  },

  formattedTime : function(){
    var obj = this.toObject();
    var value = obj.duration;
    return tools.formattedTime(value);
  },

  seedData: [
    {
      "name": "linux start",
      "tutorid": "1",
      "courseid":"1",
      "sectionid":"1",
      "format": "mp4",
      "duration": "130",
      "path": "/media/tutors/1/courses/1/hres/m1-s1.mp4",
      "id": 1,
      "sequence":0,
      "nextid":2,
      "createdAt": "2014-12-06T21:48:31.816Z",
      "updatedAt": "2014-12-06T21:48:31.816Z"
    },
    {
      "name": "linux start",
      "tutorid": "1",
      "courseid":"1",
      "sectionid":"1",
      "format": "mp4",
      "duration": "50",
      "path": "/media/tutors/1/courses/1/hres/m1-s2.mp4",
      "id": 2,
      "sequence":1,
      "nextid":-1,
      "createdAt": "2014-12-06T21:49:08.458Z",
      "updatedAt": "2014-12-06T21:49:08.458Z"
    }
  ]
};

