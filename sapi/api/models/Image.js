
var tokenHelper = require("../services/tokenHelper.js");
var tools = require("../services/common/tools.js");

module.exports = {

  attributes: {

    fileName:{
      type:"string"
    },

    fileSize:{
      type:"integer"
    },

    category: {
      type: "string",      // {'background','props','text'}
      enum: ["background", "props", "text", "font", "personal"],
      defaultsTo: "background"
    },

    contentType: {
      type: "string"
    },

    width: {
      type: "integer"
    },

    height:{
      type:"integer"
    },

    tag:{
      type: "string",
      required: false
    },

    size: {
      type: "integer"
    },

    owner:{
       type: "integer"
    },

    thumbData:{
      type:"string"
    },

    originFile:{
      model:"File"
    }
  }
};

