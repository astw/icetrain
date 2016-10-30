
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var secret = "this is my secret";

module.exports = {
  register: register,
  checkUsername: checkUsername,
  checkEmail: checkEmail,
  updateUserAccountUserNameAndPassword: updateUserAccountUserNameAndPassword
}

function updateUserEmail(req,res) {
  var userid = req.param('uid');
  var newEmail = req.body.newEmail;
  var oldEmail = req.body.oldEmail;

  if (!username) {
    return res.status(200).send('false');
  }

  var userToUpdate = {
    email: email,
    oldEmail: oldEmail,
    newEmail: newEmail
  };

  User.findOne({email: oldEmail}, function (err, userFound) {
    if (!userFound) {
      return res.status(200).send('false');
    }
    else {
      if (req.session.userid !== userid) {
        return res.status(301).send("You cannot change other person's account");
      }

      User.findOne({email: oldEmail}, function (err, userByUserName) {
        if (!user || user.id == userid) {
          // The user name is not used, or the same person
          userFound.username = username;
          User.findOne({email: newEmail}, function (err, userByEmail) {
            if (!userByEmail || user.id == userid) {
              // The email address is not used, or the same email address
              userToUpdate.email = newEmail;

              userFound.save(userFound, function (err, userFound) {
                if (err) {
                  return defer.reject(err);
                }
                else{
                  defer.resolve(userFound)
                }
              })

            } else {
              return res.status(400).send('Email has been used');
            }
          })
        } else {
          return res.status(400).send('Username has been used');
        }
      })
    }
  })
}

function updateUserAccountUserNameAndPassword(req, res) {
  var userid = req.param('uid');
  var username = req.body.userName;
  var password = req.body.password;

  if (!username || !password) {
    return res.status(200).send('false');
  };

  User.findOne({id: userid}, function (err, userFound) {

    if (!userFound) {
      return res.status(200).send('false');
    }
    else {
      if (req.session.userid !== userid) {
        return res.status(301).send("You cannot change other person's account");
      }

      User.findOne({userName: username}, function (err, userByName) {
        if (!userByName || userByName.id == userid) {
          // The user name is not used, or the same person
          userFound.userName = username;
          userFound.password = password;

          userFound.save(userFound, function (err, userUpdated) {
            if (err) {
              return res.status(500).send(err);
            } else{
              return res.status(200).send(userUpdated);
            }})
        }
        else {
          return res.status(400).send('Username has been used');
        }
      })
    }
  });
}

function checkUsername(req,res){
  var username = req.params.username;
  if(!username){
    return res.status(200).send('false');
  };

  User.findOneByUsername(username, function (err, user) {
    if (!user) {
      return res.status(200).send('false');
    }
    else {
      return res.status(200).send('true');
    }
    ;
  })
}

function  checkEmail(req,res) {
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
};

function  register(req, res) {
  var email = req.body.email;
  var userName = req.body.userName;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
console.log('post-body',req.body);
  if (!email || !userName || !password || !confirmPassword || password != confirmPassword) {
    return res.status(400).send({
      message: "invalid data"
    });
  }
 
 User.findOne({
  or:[
    {email:email},
    {userName:userName}
  ]
 }).exec(function(err, user){
     console.log('err=', err); 
     console.log(user); 

      if (err || user) return res.status(400).send(err); 
      if(!user){
          // No user found   

          User.create({
            email: email,
            userName:userName,
            displayName: userName,
            password: password
          }).exec(function (err, user) { 
            console.log("inside user creat");
            console.log(err)
            console.log(user);
            if (err) return res.status(400).send(err);

            var token = sessionTokenHelper.createSessionToken(user, res);
            res.status(200).send({
              user: user.toJSON(),
              token: token
            });
          }); 
      }
 }) 
}
