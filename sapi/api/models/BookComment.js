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

    comment: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 200
    },

    book:{
      model:"Book"
    },

    author: {
      model:"User"
    }
  }
};

