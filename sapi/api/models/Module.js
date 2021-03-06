/**
* Module.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    name: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 200
    },

    desc: {
      type: "string"
    },

    tutor: {
      model: "User"
    },

    course:{
      model:"Course"
    },

    next:{
      model: "Module"
    },

    sections: {
      collection: "Section",
      via: "module"
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

    viewTimes: {
      type: "integer",
      defaultsTo: -1
    },

    moduleType: {
      type:"string"     // would be used to control for regular user or pay user.
    },

    enId: function () {
      var obj = this.toObject();
      return tokenHelper.getCourseToken(obj.id);
    },

    formattedTime: function () {
      var obj = this.toObject();
      var value = obj.duration;
      return tools.formattedTime(value);
    }
  },

  seedData: []
}
