/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Q = require("q");
var tokenHelper = require("../services/tokenHelper.js");
var tools = require("../services/common/tools.js");

module.exports = {
  //autoPK: true,
  attributes: {
    name: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 200
    },

    desc: {
      type: "string"
    },

    tutor: {
      model: "User"
    },

    modules: {
      collection: "Module",
      via: "course"
    },

    duration: {
      type: "integer",
      defaultsTo: -1
    },

    tags: {
      type: "string"
    },

    status: {
      type: "string",
      enum: ["processing", "opened", "closed"],
      defaultsTo: "processing"
    },

    rate: {
      type: "integer",
      defaultsTo: 0
    },

    rank: {
      type: "integer",
      defaultsTo: 0
    },

    viewTimes: {
      type: "integer",
      defaultsTo: -1
    },

    releasedAt: {
      type: "datetime"
    },

    level: {
      type: "string",
      enum: ["beginner", "medium", "advanced"],
      defaultsTo: "medium"
    },

    courseType: {
      type: "string"
    },

    enId: function () {
      var obj = this.toObject();
      return tokenHelper.getCourseToken(obj.id);
    },

    formattedTime: function () {
      var obj = this.toObject();
      var value = obj.duration;
      return tools.formattedTime(value);
    }
  },

  seedData: [{
    "name": "c# WCP starter",
    "desc": "to learn the baisc of wcf programming",
    "tutor": '1' ,
    "duration":120,
    "tags":"c#,wpf",
    "status": "processing",
    "rate" : 5,
    "rank" : 3,
    "viewtimes": 1,
    "coursetype":".net",
    "level":"medium",
    "id":1
  },
    {
      "name": "java starter",
      "desc": "to learn the baisc of java programming",
      "tutor": 2 ,
      "duration":120,
      "tags":"java",
      "status": "processing",
      "rate" : 5,
      "rank" : 3,
      "viewtimes": 1,
      "coursetype":"java",
      "level":"medium",
      "id":2
    }]
};

