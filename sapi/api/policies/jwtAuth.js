var jwt = require("jwt-simple");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var urlQuery = require('url');

getSessionToken = function(req){ 
  var sessionToken ='';
  if (!req.headers || !req.headers.authorization) {
    // check query string
    var query = urlQuery.parse(req.url,true).query;
    sessionToken = query.sessionToken;
    console.log('trying to get token from query string');
  }
  else{
    console.log('req.headers.authorization=',req.headers.authorization);
    sessionToken = req.headers.authorization.split(" ")[1];
  }

  if(!sessionToken){
    sessionToken = req.headers['auth-token'];
  }
  if(sessionToken =='undefined') sessionToken = null;
  return sessionToken ;
};


module.exports = function(req, res, next) {
  var token = getSessionToken(req); 
  if (token) {
    
    var payload = sessionTokenHelper.getPayloadFromSessionToken(token);     //jwt.decode(token, secret);
    if (!payload ||  !payload.userid) {
      return res.status(401).send({
        message: "Authentication failed - jwtAuth"
      });
    }
    else {
      req.session.userid = payload.userid;
      req.headers.uid = payload.userid;
      next();
    } 
  } else { 
    return res.status(401).send({
      message: "Authentication failed - jwtAuth"
    });
  }
};
