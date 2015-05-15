/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

 	 'new':function(req,res){
 	 	res.view();
 	 },

 	create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body);

    Product.findOrCreate({name:req.body.password,quantity:101})
    .exec(function(err, p){
    	console.log(p);
    	 User.findOrCreate({name:req.body.name})
    	 .exec(function (err, u) {
            if (err) {
               res.writeHead(400, {"Location": "/error"});
           }
           u.products.add(p);
           u.save();

           console.log(u);

         });
    });

    res.end();

   }
}

