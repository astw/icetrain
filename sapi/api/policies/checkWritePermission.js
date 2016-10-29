var jwt = require("jwt-simple");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");

module.exports = function(req, res, next){

    var token = req.headers.authorization.split(" ")[1]; 
    var payload = sessionTokenHelper.getPayloadFromSessionToken(token); 
    var headerUserId = req.headers.uid;
    var userid = payload.userid;
    if (!userid ) {
        return res.status(401).send({
            message: "Authentication failed,no userId - checkWritePermission"
        });
    }
    else {
      Permission.findOneByUserid(userid).
        exec(function (err, permission) { 

          if (err || !permission || permission.type !== 'write') {
            return res.status(401).send({
              message: "You don't have write permission. - checkWritePermission"
            });
          }
          else {
            if(req.method === 'PUT' || req.method === 'DELETE') {
              // use can only write to his/her own course/module/videos
              if(headerUserId != userid){
                return res.status(401).send({
                  message: "You don't have write permission(Not your course). - checkWritePermission"
                });
             }
             
             next(); 
            }
            else{ 
              next();
            }
          };
        });
    }
};
