/**
* CourseSection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tokenHelper = require("../services/tokenHelper.js");
var tools = require("../services/common/tools.js");

module.exports = {

  attributes: {

    title: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 200
    },

    desc: {
      type: "string"
    },

    course:{
      model:"Section"
    },

    module: {
      model: "Module"
    },

    next: {
      model: "Section"
    },

    videos: {
      collection: "Video",
      via: "section"
    },

    duration: {
      type: "integer",
      defaultsTo: -1
    },

    tags: {
      type: "string"
    },

    rate: {
      type: "integer",
      defaultsTo: 0
    },

    openToAll: {
      type: "boolean",
      defaultsTo: true
    },

    enId: function () {
      var obj = this.toObject();
      return tokenHelper.getSectionToken(obj.id);
    },

    formattedTime: function () {
      var obj = this.toObject();
      var value = obj.duration;
      return tools.formattedTime(value);
    }
  },

  seedData: []
};

