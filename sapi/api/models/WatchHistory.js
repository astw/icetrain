/**
* WatchHistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {

    user: {
      model: "User",
      required:"true"
    }, 

    course:{
      model:"course",
      required:"true"
    },

    module:{
      model:"Module"
    },
  
    video:{
      model:"video"
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
