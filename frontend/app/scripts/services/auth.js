'use strict';

angular.module('psJwtApp')
    .service('auth', function ($http, API_URL, authToken, $state, $window, $q) {

        var url = API_URL + "login";

        function authSuccessful(res) {
            authToken.setToken(res.token);
            $state.go('main');
        }

        this.login = function (email, password) {
            return $http.post(url, {
                    email: email,
                    password: password
                })
                .success(authSuccessful);
        }

        this.register = function (email, password) {
            return $http.post(API_URL + 'register', {
                email: email,
                password: password
            }).success(authSuccessful);
        }

        var clientId = "330963785259-4e2l7l5kp630riijjlk33itveiabs8o6.apps.googleusercontent.com";
        var urlBuildere = [];
        urlBuildere.push('response_type=code');
        urlBuildere.push("client_id=" + clientId);
        urlBuildere.push("redirect_uri=" + window.location.origin);
        urlBuildere.push("scope=profile email");
        this.googleAuth = function () {

            var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuildere.join("&");
            var options = "width=500, height=500, left=" + ($window.auterWidth - 500) / 2 + ", top=" + ($window.outerHeight - 500) / 2.5;

            var deferred = $q.defer();

            var popup = $window.open(url, '', options);
            $window.focus();
            $window.addEventListener('message', function (event) {
                if (event.origin === $window.location.origin) {
                    var code = event.data;
                    popup.close();

                    $http.post(API_URL + "auth/google", {
                        code: code,
                        clientId: clientId,
                        redirectUri: window.location.origin
                    }).success(function (jwt) {
                        authSuccessful(jwt);
                        deferred.resolve(jwt);
                    })
                }
            });
            return deferred.promise;
        }
    });