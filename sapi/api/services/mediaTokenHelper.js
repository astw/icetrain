var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");
var secret = config.VIDEO_TOKEN_SECRET;

var Hashids = require("hashids"),
    hashids = new Hashids(secret);

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

    createVideoToken: function (mediaId, tutorId, path) {

        var payload ={
            mediaId : mediaId,
            tutorId:tutorId,
            path:path
        }
        var token = jwt.encode(payload, secret);
        return token;

        var shortId = hashids.encode(mediaId);
        return shortId;

    },

    getVideoInfo: function(mediaToken){
        var token = jwt.decode(mediaToken, secret);
        return token;

        var payload = hashids.decode(mediaId);
        return payload ;
    },

    getEnId : function(mediaId){
      return hashids.encode(mediaId);
    },

    getId : function(encodeId){
      return hashids.decode(encodeId);
    }

};
