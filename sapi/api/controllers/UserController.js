/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


function UserController(){}

UserController.prototype.updateUserProfile = updateUserProfile;
UserController.prototype.getUserProfile = getUserProfile;

UserController.prototype.auth = auth;

module.exports = {
  auth:auth,
  updateUserProfile:updateUserProfile

}

//----------------------------------------------------------------------
function updateUserProfile(req,res){

	  var userid = req.param('uid');
	  var newUserName = req.body.newUserName;
	  var newEmail = req.body.newEmail;
	  var oldUserName = req.body.userName;
	  var oldEmail = req.body.email
	  var occupation = req.body.occupation;
	  var location = req.body.location;
	  var interests = req.body.interests;

console.log("userid=", userid);
console.log(req.session.userid);

	  if (req.session.userid !== userid && req.session.role != 'admin') {
	    return res.status(301).send("You cannot change other person's account");
	  }

	  if (!newEmail || !oldEmail || !newUserName || !oldUserName) {
	    return res.status(400).send('false');
	  };

	 User.update({id:userid, email:oldEmail, userName:oldUserName}
	 	 ,{userName:newUserName, email:newEmail},
	 	 function(err, userUpdated) {

    	if(err){
    		sails.log.erro("UserProfileService.updateUserProfile failed, error:", error);
    		return res.status(500).send(err);
    	}

    	if(!userUpdated || userUpdated.length == 0){
    	   sails.log.error("UserProfileService.updateUserProfile failed. User with id="+ userid + " cannot be found");
    	   return res.status(400).send('false');
    	}

       console.log('========= ', userUpdated);
       userUpdated = [].concat(userUpdated)[0];



    	// create or update user profile
    	var profile = {
			user:userUpdated.id,
			occupation:occupation,
			location:location,
			interests:interests
    	};

    	//-----------------------
    	UserProfile.updateOrCreate({user:userUpdated.id}, profile, function(err, newProfile){
            if(err){
                 sails.log.error("saving profileIcon failed. Error=", err);
                 return res.status(500).send(err);
            }


           newProfile = [].concat(newProfile);
           var id = newProfile[0].id;

           if(userUpdated.profile){
    	      userUpdated.profile = newProfile;
    	      return res.status(200).send(userUpdated);
           }

           // update User.profile field
           User.update({id:userFound.id}, {profile:id}, function(err, updatedUser){
              if(err){
                sails.log.error("error to find user id:",id);
                return res.status(500).send(err);
              }

              sails.log.info("update user.profile finished ");
              updatedUser.profile = newProfile;
    	      return res.status(200).send(updatedUser);
            });
        })
    })
}

function getUserProfile(req, res){

}

function auth(req,res){
	 console.log(req.query.username);
     console.log(req.query.password);

	activeDirectory.auth(req.query.username,req.query.password);
	res.status(200).send("autho finish");
}
