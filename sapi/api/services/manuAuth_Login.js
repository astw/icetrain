
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");

module.exports = {

  loginByUserNameOrEmail:function(req, res){

    console.log("inside manuAuth_Login.js loginByUserNameOrEmail");

    var userNameOrEmail = req.body.userNameOrEmail;
    var password = req.body.password;

    if (!userNameOrEmail || !password) {
      return res.status(401).send({
        message: "username (or email) and password required."
      });
    }

    var condition = {
      or:[
        {userName:userNameOrEmail},
        {email:userNameOrEmail}
      ]
    }

     var promise = User.findOne(condition).populate("icon");

     promise.then(function(foundUser){
     //compare password hash

      bcrypt.compare(password, foundUser.password, function (err, valid) {
        if (err) return res.status(403);

        if (!valid) {
          return res.status(401).send({
            message: "username or password invalid."
          });
        }
        foundUser.icon = foundUser.icon ? foundUser.icon.id:'';
        var oldDateObj = new Date();
        var newDateObj = new Date(oldDateObj.getTime() + 60000);
        req.session.cookie.expires = newDateObj;
        createSendToken(foundUser, res,200);
      });
     })

     .catch(function(err){
        console.log(err);
       return res.status(401).send({
          message: "username or password invalid."
        });
     })
  },

  login: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(401).send({
        message: "email and password required."
      });
    }

    User.findOneByEmail(email, function (err, foundUser) {

      if (!foundUser) {
        return res.status(401).send({
          message: "username or password invalid."
        });
      };

      //decrypt
      bcrypt.compare(password, foundUser.password, function (err, valid) {
        if (err) return res.status(403);

        if (!valid) {
          return res.status(401).send({
            message: "username or password invalid."
          });
        }

        var oldDateObj = new Date();
        var newDateObj = new Date(oldDateObj.getTime() + 60000);
        req.session.cookie.expires = newDateObj;
        req.session.user = foundUser;
        createSendToken(foundUser, res,200);

        //update lastSign datetime
        var signInTimes = foundUser.signInTimes ? foundUser.signInTimes + 1: 1;
        User.update({email:email},{signInTimes:signInTimes}).exec();

      });
    })
  },

  local_login : function(req, res){

  },
  local_logout : function(req, res){
    req.session.user = null;
    req.session.userid = null;
    res.status(200);
    // res.redirect('/');
  }
}
