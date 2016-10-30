var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");

var secret = config.SESSION_TOKEN_SECRET;

module.exports = {
 
    createSessionToken: function (user, res) {
        var payload = {
            //iss: req.hostname,
            userid: user.id,
            exp: moment().add(10, 'days').unix()
        };

        var token = jwt.encode(payload, secret);
        return token;
    },

    getPayloadFromSessionToken: function(sessionToken){
        if(!sessionToken) return null;  
        var payload = jwt.decode(sessionToken, secret);
        if(!payload){
            if(payload.exp <= moment().unix()){
                return null;
            }
        }
        return payload;
    }
};
