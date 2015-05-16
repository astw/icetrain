var jwt = require("jwt-simple");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");

module.exports = function(req, res, next){

    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({
            message: "You are not authorized"
        });
    }

    var token = req.headers.authorization.split(" ")[1];
    var payload = sessionTokenHelper.getPayloadFromSessionToken(token);     //jwt.decode(token, secret);

    if (!payload.userid) {
        return res.status(401).send({
            message: "Authentication failed"
        });
    }

    req.session.userid = payload.userid;

    next();
};
