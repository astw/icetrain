var jwt = require("jwt-simple");
var moment = require("moment");

var sessionTokenHelper = require("../services/sessionTokenHelper.js");

var secret = "this is my secret";

module.exports = function (user, res) { 

    var token = sessionTokenHelper.createSessionToken(user,res);

    res.status(201).send({
        user: user.toJSON(),
        token: token
    });
};
