/**
 * Created by Administrator on 05/07/2015.
 */
'use strict';

angular.module('icetraiFront')
  .service('watchHistoryService', function ($http, $q, authToken, auth, $cookieStore) {

    var user = auth.currentUser();

    var API_URL = 'http://localhost:1337/';

    var getAuthHeader = function (uid) {
      var token = authToken.getToken();
      if (token)
        return 'Bearer ' + token;
    };

    var getHeader = function () {
      return {
        clientkey: 'this is the client key',
        Authorization: getAuthHeader()
      };
    };

    this.getUserWatchHistory = function (uid) {

      var url = API_URL + "users/" + uid + "/watchhistory";
      var headers = getHeader();
      var dfd = $q.defer();
      $http.get(url, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.getUserCourseWatchHistory = function (uid,cid) {

      var url = API_URL + "users/" + uid + "/watchhistory/" + cid;
      var headers = getHeader();
      var dfd = $q.defer();
      $http.get(url, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.addUserWatchHistory = function (uid, cid, mid, vid) {

      var API_URL = 'http://localhost:1337/';
      var url = API_URL + "users/" + uid + "/watchhistory";
      var headers = getHeader();

      var data = {
        userid: uid,
        courseid: cid,
        moduleid: mid,
        videoid: vid,
        status: 'watching'
      };
      var dfd = $q.defer();
      $http.post(url, data, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.updateWatchHistoryWatched = function (uid, cid, mid, vid) {

      var API_URL = 'http://localhost:1337/';
      var url = API_URL + "users/" + uid + "/watchhistory";
      var headers = getHeader();


          var data = {
            userid:uid,
            courseid: cid,
            moduleid: mid,
            videoid: vid,
            status: 'watched'
          };

          var dfd = $q.defer();
          url = API_URL +"users/" + uid + "/watchhistory"

          $http.put(url, data, {headers: headers})
            .then(function (res) {
              console.log(res);
              dfd.resolve(res);
            });

            return dfd.promise;
     }
  }
)
