
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var secret = "this is my secret";

module.exports = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    if(!email || !password || !password2 || password != password2){
        return res.status(400).send({
            message:"invalid data"
        });
    }

    User.create({
        email:email,
        password:password
    }).exec(function(err, user){
        if(err) return res.status(403);
        console.log("create user");
        var token = sessionTokenHelper.createSessionToken(user,res);
        res.status(200).send({
         user: user.toJSON(),
         token: token
       });
    });
};
