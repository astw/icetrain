/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');
var ObjectID = require('mongodb').ObjectID;

module.exports = {

  attributes: {

    // id:{
    //   //type:'integer',
    //   type:'objectid',
    //   primaryKey:true,
    //   autoIncrement:true,
    //   // columnName:'userId'
    //   },

    userId:{
      type:'integer',
      autoIncrement:'true'
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

    occupation:{
      type:"string"
    },

    location:{
      type:"string"
    },

    interests: {
      type: "string"
    },

    icon:{
      model:'Media'
    },

    thirdPartyId :{
      type:"string"
    },

    thirdPartyType:{
      enum: ["google", "facebook", "wechat", "test"]
    },

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
      "email": "aa@aa.com",
      "userName":"wangshuhao",
      "password": "123456",
      "displayName": "wang shu hao"
    },
    {
      "email": "bb@aa.com",
      "userName":"sunwenyan",
      "password": "123456",
      "displayName": "sun wen yan"
    },

    {
      "email": "cc@aa.com",
      "userName":"kelvinwang",
      "password": "123456",
      "displayName": "Kelvin Wang"
    }
  ]
};
