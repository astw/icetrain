/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

 auth:function(req,res){
     console.log(req.query.username);
     console.log(req.query.password);

	activeDirectory.auth(req.query.username,req.query.password);
	res.status(200).send("autho finish");
 }
};

