var jwt = require("jwt-simple");
var moment = require("moment");

var sessionTokenHelper = require("../services/sessionTokenHelper.js");

var secret = "this is my secret";

module.exports = function (user, res) {
//    var payload = {
//        //iss: req.hostname,
//        userid: user.id,
//        exp: moment().add(10, 'days').unix()
//    };
//
//    var token = jwt.encode(payload, secret);

    var token = sessionTokenHelper.createSessionToken(user,res);

    res.status(201).send({
        user: user.toJSON(),
        token: token
    });
};
