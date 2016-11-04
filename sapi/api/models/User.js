/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  attributes: {
    id:{
      type:'objectid',
      primaryKey:true
    },

    email: {
      type: "string",
      required: true,
      email: true,
      unique: true
    },

    emailConfirmed:{
      type:"boolean",
       defaultsTo: false
    },

    userName:{
      type:"string",
      required:true,
      unique:true
    },

    password: {
      type: "string",
      required: true
    },

    userType: {
      type: "string",
      enum: ["regular", "teacher", "enterpriseAdmin", "test"],
      defaultsTo: "regular"
    },
 
    signInTimes:{
       type:"integer",
       defaultsTo:0
    },

    lastSiginAt :{
      type:"datetime",
      required:true,
      defaultsTo: function () {
        return new Date();
      }
    },


    //courses: {
    //  collection: "Course",
    //  via: "tutor"
    //},

    //comments:{
    //  collection:"BookComment",
    //  via:"author"
    //},

    googleId: {type: "string"},
    facebookId: {type: "string"},
    displayName: {type: "string"},
    active: {type: "boolean"},

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeUpdate:function(attributes, next){
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(attributes.password, salt, null, function (err, hash) {
        if (err) return next(err);

        attributes.password = hash;
        next();
      })
    })
  },

  beforeCreate: function (attributes, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(attributes.password, salt, null, function (err, hash) {
        if (err) return next(err);

        attributes.password = hash;
        next();
      })
    })
  },

  seedData: [
    {
      "id":"1",
      "email": "aa@aa.com",
      "userName":"wangshuhao",
      "password": "123",
      "displayName": "wang shu hao",
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    },
    {
      "id":"2",
      "email": "bb@aa.com",
      "userName":"sunwenyan",
      "password": "456",
      "displayName": "sun wen yan",
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    },
    {
      "id":"3",
      "email": "cc@aa.com",
      "userName":"kelvinwang",
      "password": "456",
      "displayName": "Kelvin Wang",
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    }
  ]
};
