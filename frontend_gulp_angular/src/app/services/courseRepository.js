/**
 * Created by Administrator on 18/05/2015.
 */
'use strict';

angular.module('icetraiFront')
.service('courseRepository',function($http,$q,authToken,auth, $cookieStore) {
    var API_URL = 'http://localhost:1337/'

    this.getCourseById = function (cid) {
      var url = API_URL + "course/" + cid;
      var headers = {
        clientkey: 'this is the client key'
      };

      var dfd = $q.defer();
      $http.get(url, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.updateCourse = function (courseInfo, uid) {
      var url = API_URL + "course/"
      var headers = {
        clientkey: 'this is the client key',
        uid:uid
      };

      var dfd = $q.defer();
      http.put(url,{headers:headers})
        .then(function(res){
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.getUserCourses = function (uid) {
      var url = API_URL + 'user/' + uid + "/courses";
      var sessionToken = authToken.getToken();

      var headers = {
        clientkey: 'this is the client key',
        uid: uid
      };

      var dfd = $q.defer();

      $http.get(url, {headers: headers})
        .then(function (data) {
          console.log(data);
          dfd.resolve(data);
        });

      return dfd.promise;
    }
  });
