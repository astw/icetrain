
module.exports = function(req, res, next){

    if (!req.headers || !req.headers.clientkey) {
        return res.status(401).send({
            message: "You don't have a client key or are using an authorized client key"
        });
    }
    if (!req.headers || !req.headers.clientkey) {
        return res.status(401).send({
            message: "You don't have a client key or are using an authorized client key"
        });
    }

    next();
};
