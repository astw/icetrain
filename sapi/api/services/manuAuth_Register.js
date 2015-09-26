
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var secret = "this is my secret";

module.exports = {

    checkEmail:function(req,res) {
        var email = req.params.email;
        if(!email){
            return res.status(200).send('false');
        };

        User.findOneByEmail(email, function (err, user) {
          if (!user) {
            return res.status(200).send('false');
          }
          else {
            return res.status(200).send('true');
          }
          ;
        })
    },

    register: function(req, res) {
      var email = req.body.email;
      var userName = req.body.userName;
      var password = req.body.password;
      var password2 = req.body.password2;

      if (!email || !userName || !password || !password2 || password != password2) {
        return res.status(400).send({
          message: "invalid data"
        });
      }

      User.create({
        email: email,
        displayName: userName,
        password: password
      }).exec(function (err, user) {
        if (err) return res.status(403).send(err);

        var token = sessionTokenHelper.createSessionToken(user, res);
        res.status(200).send({
          user: user.toJSON(),
          token: token
        });
      });
    }
}
