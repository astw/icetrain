var jwt = require("jwt-simple");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var urlQuery = require('url');

getSessionToken = function(req){
  var sessionToken ='';
  if (!req.headers || !req.headers.authorization) {
    // check query string
    var query = urlQuery.parse(req.url,true).query;
    sessionToken = query.sessionToken;
    console.log(sessionToken);
    if(!sessionToken) {
      return '';
    }
  }
  else{
    sessionToken = req.headers.authorization.split(" ")[1];
  }

  return sessionToken ;
};


module.exports = function(req, res, next) {
  var token = getSessionToken(req);

  if (token === '') {
    return res.status(401).send({
      message: "Authentication failed - jwtAuth"
    });
  }
  else {
    var payload = sessionTokenHelper.getPayloadFromSessionToken(token);     //jwt.decode(token, secret);
    if (!payload.userid) {
      return res.status(401).send({
        message: "Authentication failed - jwtAuth"
      });
    }
    else {
      req.session.userid = payload.userid;
      next();
    }
  }
};
