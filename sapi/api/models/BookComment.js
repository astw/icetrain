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
      minLength: 1,
      maxLength: 500
    },

    bookId:{
      type : 'string'
    },

    author: {
      model:"User"
    }, 

    ip:{
      type : 'string'
    },

    host:{
      type:'string'
    },

    origin:{
      type:'string'
    },

    complainedTimes:{
     type: "integer",
      defaultsTo: 0
    },

    createdAt:{
      type:"datetime",
      required:true,
      defaultsTo: function () {
        return new Date();
      }
    } 
  }
};

