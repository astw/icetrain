/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create : function  (req, res) {
        if (req.method === 'GET')
            return res.json({'status': 'GET not allowed'});

        console.log(req.body);

        User.findOne({email:req.body.tutoremail}, function(err,user){
            if(err){
                console.log(err);
            }
            console.log(user);
        });


//        Course.create({
//            name:req.body.name,
//            desc:req.body.desc,
//            tutor
//        })

//            Video.create({
//
//            })
    }
};

