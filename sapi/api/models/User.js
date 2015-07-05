/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  attributes: {
    email: {
      type: "string",
      required: true,
      email: true,
      unique: true
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

    courses: {
      collection: "Course",
      via: "tutor"
    },

    watchHistory:{
      collection:"WatchHistory",
      via: "user"
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
      "password": "123",
      "displayName": "wang shu hao",
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    },
    {
      "email": "bb@aa.com",
      "password": "456",
      "displayName": "sun wen yan",
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    }
  ]
};
