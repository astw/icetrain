var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");
var videoSecret = config.VIDEO_TOKEN_SECRET;
var courseSecret = config.COURSE_TOKEN_SECRET;
var sectionSecret = config.SECTION_TOKEN_SECRETE;
var userSecret = config.USER_TOKEN_SECRETE;
var imageSecret = config.IMAGE_TOKEN_SECRETE;


var Hashids = require("hashids"),
  videoHasher = new Hashids(videoSecret),
  courseHasher = new Hashids(courseSecret),
  sectionHasher = new Hashids(sectionSecret),
  userHasher = new Hashids(userSecret),
  imageHasher = new Hashids(imageSecret);


//var SecObfuscate = require("sec-obfuscate-nodejs"),
//    secObfuscate = new SecObfuscate('secretPassword');
//            token = encryptedValue = secObfuscate.encrypt(mediaId);
//      var id =    decryptedValue = secObfuscate.decrypt(encryptedValue);
//
//  return token;


module.exports = {
 
  // mediaId,
  // tutorId,
  // resolution:high:low
  // path,

  createVideoToken: function (mediaId, path) {

    var payload = {
      mediaId: mediaId,
      path: path
    }
    var token = jwt.encode(payload, videoSecret);
    return token;

    var shortId = videoHasher.encode(mediaId);
    return shortId;
  },
  getVideoInfo: function (mediaToken) {
    var token = jwt.decode(mediaToken, videoSecret);
    return token;

    var payload = videoHasher.decode(mediaId);
    return payload;
  },

  getVideoToken : function(id){
    return videoHasher.encode(id);
  },

  getCourseToken: function (id) {
    return courseHasher.encode(id);
  },

  getSectionToken: function (id) {
    return sectionHasher.encode(id);
  },

  getUserToken: function (id) {
    return userHasher.encode(id);
  },

  getImageToken : function(id){
    return imageHasher.encode(id);
  },

  getVideoId : function(token){
    return videoHasher.decode(token);
  },

  getCourseId: function (token) {
    return courseHasher.decode(token);
  },

  getSectionId: function (token) {
    return sectionHasher.decode(token);
  },

  getUserId: function (token) {
    return userHasher.decode(token);
  },

  getImageId:function(token){
    return imageHasher.decode(token);
  }
};
