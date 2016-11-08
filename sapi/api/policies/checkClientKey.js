
module.exports = function(req, res, next) {

  if (!req.headers || !req.headers.clientkey) {
    sails.log("no clientkey 1");
    return res.status(401).send({
      message: "You don't have a client key or are using an authorized client key"
    });
  }
  else {

    if (!req.headers || !req.headers.clientkey) {
      sails.log("no clientkey 2");
      return res.status(401).send({
        message: "You don't have a client key or are using an authorized client key"
      });
    }
    else{
      next();
    }
  }

};
