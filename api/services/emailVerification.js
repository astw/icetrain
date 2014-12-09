var _ = require("underscore");
var fs = require("fs");
var jwt = require("jwt-simple");
var config = require("./config.js");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var User = require("../models/User.js");

var secret = "this is my secret";

var model = {

    verifyUrl: "http://localhost:3000/auth/verifyEmail?token=",
    title: "psJWT",
    subTitle: "Thanks for signing up!",
    body: "Please verify your email address by clicking the buttom link"

};

exports.send = function (email) {

    var payload = {
        sub: email
    };

    var token = jwt.encode(payload, config.EMAIL_SECRET);
    var transporter = nodemailer.createTransport(smtpTransport({
        host:"smtp.163.com",
        secure: true,
        auth:{
            user:"wshuhao@163.com",
            pass:config.EMAIL_PASS
        }
    }));

    var mailOptions ={
        from:"Accounts  <wshuhao@163.com>",
        to:email,
        subject:"psJWT Account Verification",
        html:getHtml(token)
    };
    transporter.sendMail(mailOptions, function(err,info){
        if(err) return res.status(500);
        console.log(info);
    });
    console.log(getHtml(token));
};

exports.handler = function(req, res){
    var token = req.query.token;
    console.log(token);
    var payload = jwt.decode(token, config.EMAIL_SECRET);
    var email = payload.sub;
    if(!email) return handleError(res);

    User.findOne({email:email}, function(err, foundUser){
        if(err) return res.status(500);
        if(!foundUser) return handleError(res);

        if(!foundUser.active){
            foundUser.active = true;
        }

        foundUser.save(function(err){
            if(err) return res.status(500);

            return res.redirect(config.APP_URL);
        });
    });

}

function handleError(res){
    return res.status(401).send("Authentication failed, unable to verify email");
}

function getHtml(token) {
    var path = "./views/emailVerification.html";
    var html = fs.readFileSync(path, encoding = "utf8");

    var template = _.template(html);
    model.verifyUrl += token;
    return template(model);
}

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};