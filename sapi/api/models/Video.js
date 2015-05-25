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

    url: {
      type: "integer"
    },

    section:{
      model: "Section"
    },

    next: {
       model:"Video"
    },

    toJSON: function () {
      var obj = this.toObject();
      obj.id = mediaTokenHelper.createVideoToken(obj.id, obj.path);
      return obj;
    },

    playtoken:function(){
      var obj = this.toObject();
      return mediaTokenHelper.createVideoToken(obj.id, obj.path);
    },

    enId :function(){
      var obj = this.toObject();
      return mediaTokenHelper.getVideoToken(obj.id);
    }
  },

  beforeCreate: function (values, next) {
    // increate the section duration, and course duration
    // step 1 findout section

    if(values.section) {
      values.section.duration += values.duration || 0;
      values.section.save();

      if(values.section.course){
      values.course.course.duration += values.duration || 0;
      values.course.course.save();
      }
    }
    next();
  },

  beforeDestroy: function (attribute, next) {
    // decrease the section duration, and course duration

    if(attribute.duration > 0) {
      if(values.section) {
        values.section.duration -= values.duration || 0;
        values.section.save();

        if(values.section.course){
          values.course.course.duration -= values.duration || 0;
          values.course.course.save();
        }
      }
    }
    next();
  },

  formattedTime : function(){
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

