/**
* File.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    fileName: {
      type: "string"
    },

    fileType: {
      type: "string"
    },

    cat:{
      type:"string"
    },

    size:{
      type:'integer'
    },

    imageData :{
      type:"binary"
    }
  }
};

