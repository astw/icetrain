
var bcrypt = require("bcrypt-nodejs");
var createSendToken = require("./createSendToken.js");
var sessionTokenHelper = require("../services/sessionTokenHelper.js");
var emailTokenManager = require("../services/emailTokenManager.js");
var secret = "this is my secret";
var eamilSender = require("../services/emailSender/emailService.js");
var moment = require("moment");
var ObjectID = require('mongodb').ObjectID; 

module.exports = {
  register: register,
  registerConfirm:registerConfirm,
  checkUsername: checkUsername, 

  changePassword: changePassword,
  
  checkEmail: checkEmail,
  updateUserEmail:updateUserEmail,
  updateUserAccountUserNameAndPassword: updateUserAccountUserNameAndPassword
}

function changePassword(req, res) {

  console.log('inside change password, manuAuth_register.js');

  var userid = req.param('uid');
  var currentPassword = req.body.currentPassword;
  var newPassword = req.body.newPassword;
  var newPasswordConfirm = req.body.newPasswordConfirm;

  if (currentPassword === newPassword || newPassword !== newPasswordConfirm) {
    return res.status(400).send('Bad data');
  }
 
  User.findOne(userid, function (err, userFound) {
    if (!userFound) {
      console.log("user with id=" + userid + " cannot be found");
      return res.status(200).send('false');
    }
    else {
      // check currentPassword
      bcrypt.compare(currentPassword, userFound.password, function (err, valid) {

        if (err || !valid) {
          return res.status(401).send({
            message: "Wrong current password"
          });
        }  
        console.username = "test username";
        userFound.password = newPassword; 
        // userFound.id = new ObjectID(userFound.id);
        console.log(userFound);
        userFound.save(userFound, function (err, userUpdated) {
              if (err) {
                 console.log(err, userUpdated);
                return res.status(500).send(err);
              } else {
                console.log("password is changed to be:", newPassword);
                return res.status(200).send(userUpdated);
              }
        })
      })
    }
  }) 
}

function registerConfirm(req,res){
   var token = req.param("token");
   var payload = emailTokenManager.getPayloadFromRegistrationWelcomeToken(token);

   if(payload && payload.exp <= moment().unix()){
     return res.status(400).send("token expired");
   } else {
   // update user emailConfirmed

   User.findOne({email:payload.email})
   .then(function(userFound){
         var signInTimes = userFound.signInTimes ?  userFound.signInTimes + 1: 1;

         User.update({email:payload.email}, {emailConfirmed:true, signInTimes:signInTimes})
           .exec(function(err, userUpdated){
              if(err){
                    res.status(500).send(err);
              } else {
              // Generate token and return
               var token = sessionTokenHelper.createSessionToken(userUpdated, res);
               res.status(200).send({
               user: userUpdated,
               token: token
               });
            };
          })
      })
   }
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

  if (req.session.userid !== userid) {
    return res.status(301).send("You cannot change other person's account");
  }

  if (!username || !password) {
    return res.status(200).send('false');
  };

  User.findOneById(userid, function (err, userFound) { 
    if (!userFound) {
      console.log("user with id="+ userid + " cannot be found");
      return res.status(200).send('false');
    }
    else {

      User.findOne({userName: username}, function (err, userByName) {
        if(err){
          return res.status(500).send(err);
        } 
 

        if (!userByName || userByName.id == userid) {
          // The user name is not used, or the same person 

          userFound.userName = username;
          userFound.password = password;

          userFound.save(userFound, function (err, userUpdated) {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            } else{
              console.log('update good');
              return res.status(200).send(userUpdated);
            }})
        }
        else {
          console.log(userByName); 
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

  User.findOne({userName:username}, function (err, user) {
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

            // Send welcome email
            eamilSender.sendRegisterWelcomeEmail(user)
            .then(function(sendInfo){
              return res.status(200).send(sendInfo);
            })
            .catch(function(err){
              return res.status(400).send(err);
            });
            //var token = sessionTokenHelper.createSessionToken(user, res);
            //res.status(200).send({
            //  user: user,
            //  token: token
            //});
          });
      }
 })
}
