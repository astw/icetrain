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

  changePassword:register.changePassword,
  register: register.register,
  registerConfirm:register.registerConfirm,
  
  updateUserNameAndPassword: register.updateUserAccountUserNameAndPassword,
  checkEmail: register.checkEmail,
  checkUsername: register.checkUsername,

  local_login: loginSerice.local_login,
  local_logout: loginSerice.local_logout,

  google: googleAuth,
  facebook: facebookAuth,
  getUserProfile:getUserProfile
};


function getUserProfile(req, res){
   var userid = req.param('uid');
   User.findOne({id:userid}).exec(function(err, userFound) {

      if(err){
        sails.log.erro("UserProfileService.getUserProfile failed, error:", error);
        return res.status(500).send(err);
      }

      if(!userFound){
         sails.log.error("User with id="+ userid + " cannot be found");
         return res.status(400).send('false');
      }
 
       sails.log.info("update user finished ");
       return res.status(200).send(userFound); 
    })
}