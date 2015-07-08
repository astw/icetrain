/**
 * WatchHistoryController
 *
 * @description :: Server-side logic for managing watchhistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getUserWatchHistory:function(req,res){
    console.log(req.params);
    var userid = req.params.uid;
    WatchHistory.find({user:userid}).then(function(data){
      return res.status(200).send(data);
    })
      .error(function(err){
        return res.status(404).send();
      });
  },

  getUserCourseWatchHistory:function(req,res){
    var userid = req.params.uid;
    WatchHistory.find({user:userid,courseid:cid}).then(function(data){
      return res.status(200).send(data);
    })
      .error(function(err){
        return res.status(404).send();
      });
  },

  addUserWatchHistory:function(req, res){
    var userid = req.params.uid;
    var userid_1 = req.body.user;
    if(userid != userid_1){
      return res.status(400).send();
    };

    User.findOne({id: userid}, function (err, user) {
      if (err) {
        return res.notFound();
      }
      console.log(user);
      if (user) {
        WatchHistory.create({
          user: user,
          courseid: req.body.courseid,
          moduleid: req.body.moduleid,
          videoid: req.body.videoid,
          status: req.body.status,
          watchtime: Date()
         },
          function (err, data) {
          if (err) {
            return res.status(err.status).send(err.details);
          };
           return res.status(201).send(data);
        });
      }
      else {
        return res.json({status:400},400);
      }
    });
  },

  updateWatchHistory:function(req,res){
    var userid = req.params.uid;
    var userid_1 = req.body.user;
    if(userid != userid_1){
      return res.status(400).send();
    };

    User.findOne({id: userid}, function (err, user) {
      if (err) {
        return res.notFound();
      }
      console.log(user);
      if (user) {
        WatchHistory.findOne({
            user: user,
            courseid: req.body.courseid,
            moduleid: req.body.moduleid,
            videoid: req.body.videoid
          },
          function (err, data) {
            if (err) {
              return res.status(err.status).send(err.details);
            };
            data.status = req.body.status;
            data.save().then(function(err){
              if(err){
                return res.status(400).send(err);
              }
              return res.status(200).send(data);
            });
          });
      }
      else {
        return res.json({status:400},400);
      }
    });
  },

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

