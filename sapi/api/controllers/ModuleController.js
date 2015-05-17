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

    console.log(req.body);

     Module.create({
          name: req.body.name,
          desc: req.body.desc,
          tutor: 1,
          tags: req.body.tag,
          level: req.body.level
        }, function (err, newModule) {
          if (err) {
            return res.status(err.status).send(err.details);
          };

          return res.status(201).send(newModule);
        });
  }
};

