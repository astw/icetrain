var jwt = require("jwt-simple");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");

module.exports = function(req, res, next){

    var token = req.headers.authorization.split(" ")[1];
    var payload = sessionTokenHelper.getPayloadFromSessionToken(token);

    if (!payload.userid ) {
        return res.status(401).send({
            message: "Authentication failed"
        });
    }

   Permission.findOneByUserid(payload.userid).
       exec( function(err, permission){
           if(err || !permission || permission.type !=='write') {
               return res.status(401).send({
                   message: "Authentication failed"
               });
           };
       }) ;

    next();
};
