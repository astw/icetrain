/**
* WatchHistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    user:{
      model:"User"
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
      type:"integer",
      required:true
    },
    watchtime:{
      type:"datetime",
      required:true
    }
  }
};
