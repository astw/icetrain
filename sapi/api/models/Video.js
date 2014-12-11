/**
* Video.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var mediaTokenHelper = require("../services/mediaTokenHelper.js");

module.exports = {

  attributes: {
      name:{
          type:"string",
          required:true,
          defaultsTo:""
      },
      tutorid:{
          type:"string",
          required:true
      },
      format:{
         type:"string"
      },
      duration:{
          type:"integer",
          required:true,
          defaultsTo:-1
      },

      size:{
        type:"integer"
      },

      path:{
          type:"string",
          required:true
      },

      url:{
        type:"integer"
      },

      courseid:{
          type:"integer",
          required:true,
          defaultsTo:-1
      },

      sectionid:{
          type:"integer",
          required:true,
          defaultsTo:-1
      },

      toJSON: function() {
          var obj = this.toObject();
          obj.id = mediaTokenHelper.createVideoToken(obj.id, obj.tutorid, obj.path);
          return obj;
      }
  },

    seedData:[
        {
            "name": "linux start",
            "tutorid": "1",
            "format": "mp4",
            "duration": "130",
            "path": "/media/tutors/1/courses/1/hres/m1-s1.mp4",
            "id": 1,
            "createdAt": "2014-12-06T21:48:31.816Z",
            "updatedAt": "2014-12-06T21:48:31.816Z"
        },
        {
            "name": "linux start",
            "tutorid": "1",
            "format": "mp4",
            "duration": "50",
            "path": "/media/tutors/1/courses/1/hres/m1-s2.mp4",
            "id": 2,
            "createdAt": "2014-12-06T21:49:08.458Z",
            "updatedAt": "2014-12-06T21:49:08.458Z"
        }
    ]
};

