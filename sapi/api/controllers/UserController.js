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

	  if (req.session.userid !== userid && req.session.role != 'admin') {
	    return res.status(301).send("You cannot change other person's account");
	  }

	  if (!newEmail || !oldEmail || !newUserName || !oldUserName) {
	    return res.status(400).send('false');
	  };

	 var condition = {id:userid, email:oldEmail, userName:oldUserName}; 
	 var data = { 
	 	userName:newUserName, 
	 	email:newEmail,
	 	location:location,
	 	occupation:occupation,
	 	interests:interests
	  };

	 User.update(condition, data, function(err, userUpdated) {

    	if(err){
    		sails.log.erro("UserProfileService.updateUserProfile failed, error:", error);
    		return res.status(500).send(err);
    	}

    	if(!userUpdated || userUpdated.length == 0){
    	   sails.log.error("UserProfileService.updateUserProfile failed. User with id="+ userid + " cannot be found");
    	   return res.status(400).send('false');
    	}
 
  	   sails.log.info("update user finished ");
       return res.status(200).send(userUpdated[0]); 
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
