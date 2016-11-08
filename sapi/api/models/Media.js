
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
      enum: ["background", "props", "text", "font", "profileIcon", "personal","page", "bigText"],
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
 
    owner: {
      model: "User",
      required:"true"
    },

    data:{
      type:"string"
    },

    mediaFile:{
      model:"MediaFile"
    }
  }
};

