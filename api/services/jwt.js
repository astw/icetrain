var jwt = require("jwt-simple");
var moment = require("moment");
var crypto = require("crypto");


var secret = "this is my secret";

module.exports.createSendToken = function (user, res) {
    var payload = {
        //iss: req.hostname,
        sub: user.id,
        exp: moment().add(10, 'days').unix()
    };

    var token = jwt.encode(payload, secret);

    res.status(201).send({
        user: user.toJSON(),
        token: token
    });
}

exports.encode = function(payload, secrete){
    var algorithm = "HS256";
    var header = {
        type:"JWT",
        alg:algorithm
    };
    var jwt = base64Encode(JSON.stringify(header)) +"." + base64Encode(JSON.stringify(payload)) ;
    return jwt + '.'+ sign(jwt, secrete);
};

exports.decode = function(token, secret){
	var segments = token.split(".");
	if(segments.length !=3 ){reutrn
		throw new Error("Token structure incorrect");
	}

	var header = JSON.parse(base64Decode(segments[0]));
	var payload = JSON.parse(base64Decode(segments[1]));

    var rawSignature = segments[0] +"." + segments[1];

    if(!verify(rawSignature, secret, segments[2]))
       throw new Error("Verification failed.") ;

	return payload ;
}

function verify(raw, secret, signature){
    return signature === sign(raw, secret);
}

//create an signature function
function sign(str, key){
    return crypto.createHmac("sha256", key).update(str).digest('base64');
}

function base64Encode(str){
    return new Buffer(str).toString('base64');
}

function base64Decode(str) {
	return new Buffer(str, 'base64').toString();
}

exports.login = function login(req,res, next){

    var req_user = req.body;
    var searchUser = {email:req_user.email};
    User.findOne(searchUser, function(err, user) {
        if (err) throw err;

        if(!user){
            res.status(401).send({message:"Wrong email/password matching."})
        }

        user.comparePasswords(req_user.password, function(err, isMatch) {
            if (err) throw err;

            if(!isMatch)
              return  res.status(401).send({message:"Wrong email/password matching."})

            createSendToken(user,res);
        });
    })

}
