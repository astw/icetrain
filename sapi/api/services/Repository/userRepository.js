var Q = require("q");
var fs = require('fs'),
  util = require('util');

var path = require("path")
var root = require('app-root-path') + "";

var tokenHelper = require("../tokenHelper.js");

var cache = Object();  //place hold of cache　
var getUserByEmail = function(email){

  var defer = Q.defer();
  User.findOne({email:email}).exec(function(err, user){
    if(!!err){
      defer.reject(new Error(err));
    }
    else {
      delete user.password;
      defer.resolve(user);
    }
  });
  return defer.promise;
};

var getUserById = function(id){ 

  var defer = Q.defer();
  User.findOne({id:id}).exec(function(err, user){
    if(!!err){
      defer.reject(new Error(err));
    }
    else {
      delete user.password;
      defer.resolve(user);
    }
  });
  return defer.promise;
};

module.exports = {
  getUserByEmail:getUserByEmail,
  getUserById : getUserById
};
