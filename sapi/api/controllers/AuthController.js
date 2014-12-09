/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var login = require("../services/manuAuth_Login.js");
var register = require("../services/manuAuth_Register.js");
var facebookAuth = require("../services/facebookAuth.js");
var googleAuth = require("../services/googleAuth.js");

module.exports = {
	login:login,
    register:register,
    google:  googleAuth ,
    facebook:facebookAuth
};