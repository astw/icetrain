var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");

var secret = config.EMAIL_SECRET; 

module.exports = { 
    createRegistrationWelcomeToken:function(user,res){
       var payload = { 
            email: user.email,
            exp: moment().add(1000, 'days').unix()
            //exp: moment().subtract(10, 'days').unix()
        };

        var token = jwt.encode(payload, secret);
        return token; 
    },

    getPayloadFromRegistrationWelcomeToken:function(token){
        if(!token) return null;  
        var payload = jwt.decode(token, secret);
        return payload;
    }
}