var Q = require("q");
var fs = require('fs'),
  util = require('util');

var path = require("path")
var root = require('app-root-path') + "";

var tokenHelper = require("../tokenHelper.js");

var cache = Object();  //place hold of cache　  

module.exports = {
  getUserByEmail:getUserByEmail,
  getUserById : getUserById,
  getUserByUserName:getUserByUserName
};
 
function findOneUser(condition){
  return User.findOne(condition)  
}

function getUserByUserName(userName){
  var condition = {userName:userName} 
  return findOneUser(condition);
}

function getUserById(id){ 

    var condition = {
      id:id
    }; 

    return findOneUser(condition); 
  // var defer = Q.defer();
  // User.findOne({id:id}).exec(function(err, user){
  //   if(!!err){
  //     defer.reject(new Error(err));
  //   }
  //   else {
  //     delete user.password;
  //     defer.resolve(user);
  //   }
  // });
  // return defer.promise;
};

function getUserByEmail(email){ 
    var condition = {
      email:email
    }; 

    return findOneUser(condition); 

  // var defer = Q.defer();
  // User.findOne({email:email}).exec(function(err, user){
  //   if(!!err){
  //     defer.reject(new Error(err));
  //   }
  //   else {
  //     delete user.password;
  //     defer.resolve(user);
  //   }
  // });
  // return defer.promise;
};