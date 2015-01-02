/**
* CourseSection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tokenHelper = require("../services/tokenHelper.js");

module.exports = {

  attributes: {
      courseid :{
          type:"integer",
          required:true,
          defaultsTo: -1
      },

      nextsectionid:{
        type:"integer"
      },

      title:{
          type:"string",
          required:true,
          minLength:5,
          maxLength:200
      },

      videoid:{
          type:"integer"
      },

      desc:{
          type:"string"
      },

      tutorid:{
          type: "integer",
          required:true,
          defaultsTo:-1
      } ,

      duration:{
          type:"integer",
          defaultsTo:-1
      },

      tags:{
          type:"string"
      },

      status:{
          type:"string",
          enum:["processing","opened","closed"],
          defaultsTo:"processing"
      },

      rate :{
          type:"integer",
          defaultsTo:0
      },

      viewtimes:{
          type:"integer",
          defaultsTo:-1
      },

      relased :{
          type:"datetime"
      },

      opentoall:{
          type:"boolean",
          defaultsTo:true
      },

      Course:{
        model:"Course"
      },

    enId :function(){
      var obj = this.toObject();
      return tokenHelper.getSectionToken(obj.id);
    }
  },

    seedData:
        [
            {
                "courseid": 1,
                "title": "this is the title of section 1",
                "desc": "this is desc of section 1",
                "tutorid": 1,
                "duration": 100,
                "tags": "tag for section1",
                "status": "processing",
                "rate": 10,
                "viewtimes": 20,
                "opentoall": true,
                "videoid":1,
                "id":1
            },

            {
                "courseid": 2,
                "title": "this is the title of section 2",
                "desc": "this is desc of section 2",
                "tutorid": 2,
                "duration": 100,
                "tags": "tag for section2",
                "status": "processing",
                "rate": 10,
                "viewtimes": 20,
                "opentoall": true,
                "videoid":12,
                "id":2
            }

        ]


};

