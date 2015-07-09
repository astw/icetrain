/**
* WatchHistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    userid:{
      type:"integer",
      required:true
    },
     courseid: {
      type: "integer",
       required:true
    },
    moduleid:{
      type:"integer",
      required:true
    },
    videoid:{
      type:"string",
      required:true
    },
    status:{
      type:'string',
      enum: ["watching", "watched"],
      defaultsTo:'watching'
    },
    watchtime:{
      type:"datetime",
      required:true
    }
  }
};
