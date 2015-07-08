
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");

module.exports = {

  login: function (req, res) {
    console.log("inside manuAuth_Login.js");
    console.log(req.body);
    
    console.log(req.body.email);
    console.log(req.body.passowrd);
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
      return res.status(401).send({
        message: "username and password required."
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
      });
    })
  },

  local_login : function(req, res){

  },
  local_logout : function(req, res){
    req.session.user = null;
    res.status(200);
    res.redirect('/');
  }
}
