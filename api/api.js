var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jwt-simple");
var passport = require("passport");
var moment = require("moment");

var createSendToken = require("./services/jwt.js").createSendToken;
var facebookAuth = require("./services/facebookAuth.js");
var googleAuth = require("./services/googleAuth.js");
var LocalStrategy = require("./services/localStrategy.js");
var jobs = require("./services/jobs.js");
var emailVerification = require("./services/emailVerification.js");

var app = express();

// to enable access json data in request body
app.use(bodyParser.json());
app.use(passport.initialize());

// use passport as middleware
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//local-register is the customerized name
passport.use("local-register", LocalStrategy.register);
passport.use("local-login", LocalStrategy.login);

// to enable cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

var secret = "this is my secret";

// set routes 
app.get("/jobs", jobs);

app.post("/auth/google", googleAuth);
app.post("/auth/facebook", facebookAuth);

// passport.authenticate("local-login") is the middleware to handle login
app.post("/login", passport.authenticate("local-login"), function (req, res) {
    createSendToken(req.user, res);
});

// passport.authenticate("local-register") is the middleware to handle register
app.post("/register", passport.authenticate("local-register"), function (req, res) {
     emailVerification.send(req.user.email);
     createSendToken(req.user, res);
});

app.get("/auth/verifyEmail", emailVerification.handler);
// connect to mongo db

mongoose.connect("mongodb://localhost:27017/psjwt");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connecting error"));
db.on("open", function callback() {
    console.log("connecting to db succeed");
});

var server = app.listen(3000, function () {
    console.log("API is listening on " + server.address().port + "......");
});