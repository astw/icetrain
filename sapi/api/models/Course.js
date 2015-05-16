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

    sections: {
      collection: "CourseSection",
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

  seedData: []
};

