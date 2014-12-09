
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");

module.exports = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    if(!email || !password){
        return res.status(401).send({
            message:"username and password required."
        });
    }

    User.create({
        email:email,
        password:password
    }).exec(function(err, user){
        if(err) return res.status(403);
        console.log("create user");
        createSendToken(user,res);
    });
};