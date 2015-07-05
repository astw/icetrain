/**
 * WatchHistoryController
 *
 * @description :: Server-side logic for managing watchhistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  create: function (req, res) {
    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});

    console.log(req.body);
    WatchHistory.create({
      user: req.body.userid,
      courseid:req.doby.courseid,
      moduleid: req.body.moduleid,
      videoid:req.body.videoid,
      watchdate: new Date()
    }, function (err, newModule) {
      if (err) {
        return res.status(err.status).send(err.details);
      };

      return res.status(201).send(newModule);
    });
  }
};

