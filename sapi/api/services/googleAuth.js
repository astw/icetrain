
var request = require("request");
var createSendToken = require("./createSendToken.js");
var config = require("./config.js");

module.exports = function (req, res) {

    console.log(req.body.code);
    var url = 'https://accounts.google.com/o/oauth2/token';
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: config.GOOGLE_SECRETE
    };

    request.post(url, {
        json: true,
        form: params
    }, function (err, response, token) {
        var accessToken = token.access_token;

        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        request.get({
            url: apiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            console.log(profile);

            User.findOne({
                googleId: profile.sub
            }, function (err, founderUser) {
                if (founderUser) return createSendToken(founderUser, res);

                User.create({
                    fileType:profile.email,
                    fileSize:profile.sub,
                    displayName:profile.name
                }).exec(function(err, user){
                    if(err){
                        console.log("create user fails..." + err);
                        return res.status(403).send(err);
                    }
                    console.log("create user ok");
                    createSendToken(user,res);
                });

            });
        });

    });
};
