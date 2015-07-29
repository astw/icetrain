/**
 * ModuleController
 *
 * @description :: Server-side logic for managing modules
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body.course);
    Course.findOne({id:req.body.course.id}).then(function (course) {
      console.log(course);
      console.log('check req.session.userid');
      console.log(req.session.userid);
      if (course.tutor != req.session.userid) {
        return res.status(401).send("Cannot change other people's class");
      }
      else {
        Module.create({
          name: req.body.name,
          desc: req.body.desc,
          tutor: course.tutor,
          course: req.body.course,
          tags: req.body.tag,
          level: req.body.level
        }, function (err, newModule) {
          if (err) {
            return res.status(err.status).send(err.details);
          } ;

          return res.status(201).send(newModule);
        });
      }
    });
  }
};

