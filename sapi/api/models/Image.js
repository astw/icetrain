
var tokenHelper = require("../services/tokenHelper.js");
var tools = require("../services/common/tools.js");

module.exports = {

  attributes: {

    category: {
      type: "string",      // {'background','props','text'}
      enum: ["background", "props", "text", "personal"],
      defaultsTo: "background"
    },

    format: {
      type: "string"
    },

    width: {
      type: "integer"
    },

    height:{
      type:"integer"
    },

    path: {
      type: "string",
      required: true
    },

    tag:{
      type: "string",
      required: false
    },

    size: {
      type: "integer"
    },

    owner:{
       type: 'integer'
    },

    toJSON: function () {
      var obj = this.toObject();
      obj.id = tokenHelper.getImageToken(obj.id);
      return obj;
    },

   enId :function(){
     var obj = this.toObject();
     return tokenHelper.getImageToken(obj.id);
   }
  }
};

