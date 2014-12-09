var User = require("../models/User.js");
var request = require("request");
var createSendToken = require("./jwt").createSendToken;
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

                var newUser = new User();
                newUser.googleId = profile.sub;
                newUser.displayName = profile.name;
                newUser.save(function (er) {
                    if (err) {
                        return next(err);
                    };
                    createSendToken(newUser, res);
                });

            });
        });

    });

}