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

    user: {
      model: "User",
      required:"true"
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
    }
  },

  updateOrCreate: function(criteria, values, cb){
      var self = this; // reference for use by callbacks
      // If no values were specified, use criteria
      if (!values) values = criteria.where ? criteria.where : criteria;
console.log('criteria=' , criteria);
      this.findOne(criteria, function (err, result){
        if(err) return cb(err, false);

        if(result){
          self.update(criteria, values, cb);
        }else{
          self.create(values, cb);
        }
      });
    },

  seedData: [

  ]
};
