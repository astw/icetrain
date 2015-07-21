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

    course: {
      model: "Course"
    },

    next: {
      model: "Module"
    },

    videos: {
      collection: "Video",
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
      type: "string"     // would be used to control for regular user or pay user.
    },

    getVideos: function () {
      var obj = this.toObject();
      var defer = Q.defer();
      Video.find({module: obj})
        .then(function (videos) {
          defer.resolve(videos);
        });
      return defer.promise;
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

  beforeCreate:function(element,next){
    console.log('module before create');
    console.log(element); 
    next();
  },

  afterDestroy: function (elements, next) {
    //console.log(attribute);
    //update the course duration
    if (!elements || elements.length < 1) next();
    elements.forEach(function (attribute) {

      if (attribute.duration <= 0) return;
      var duration = attribute.duration;
      Course.findOne({id: attribute.course}).then(function (course) {
        course.duration -= duration;
        course.save();
      });

      //destroy videos that belong to this module
      Video.find({module: attribute.module}).then(function (vs) {
        var videos = [].concat(vs);
        videos.forEach(function (video) {
          video.destroy();
          video.save();
        });
      });
    });

    next();
  },

  seedData: [{
    "name": "c# WCP starter module 1",
    "desc": "to learn the baisc of wcf programming",
    "course": {"id": 1}
  },
    {
      "name": "java starter  module2",
      "desc": "to learn the baisc of java programming",
      "course": {"id": 1}
    }]
}
