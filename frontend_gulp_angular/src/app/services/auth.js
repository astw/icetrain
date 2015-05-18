'use strict'

angular.module('icetraiFront')
.service('auth',function($http,$window,$q, $location,authToken, $cookieStore) {

    var API_URL = 'http://localhost:1337/auth/';
    var clientkey = "this is the client key";
    var cookieKey = "iceTrainUser";

    function authSuccessful(data) {
      authToken.setToken(data.token);
      $cookieStore.put(cookieKey,data.user);
    }

    var headers =
    {
      clientkey: clientkey
    };

    this.login = function (email, password) {
      var dfd = $q.defer();

      var url = API_URL + "login";
      var message = {email: email, password: password};
      $http.post(url,
        message,
        {headers: headers}
      ).then(function (res) {
          if (res.status == 200) {
            authSuccessful(res.data);
          }

          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.logout = function () {
      authToken.removeToken();
      $cookieStore.remove(cookieKey);
    };

    this.currentUser = function () {
      return $cookieStore.get(cookieKey);
    };

    this.isAuthenticated = function () {
      return !!authToken.getToken();
    };
  });
