/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var loginSerice = require("../services/manuAuth_Login.js");
var register = require("../services/manuAuth_Register.js");
var facebookAuth = require("../services/facebookAuth.js");
var googleAuth = require("../services/googleAuth.js");

module.exports = {
  login: loginSerice.login,
  loginByUserNameOrEmail:loginSerice.loginByUserNameOrEmail,
  register: register.register,
  registerConfirm:register.registerConfirm,
  
  updateUserNameAndPassword: register.updateUserAccountUserNameAndPassword,
  checkEmail: register.checkEmail,
  checkUsername: register.checkUsername,

  local_login: loginSerice.local_login,
  local_logout: loginSerice.local_logout,

  google: googleAuth,
  facebook: facebookAuth
};
