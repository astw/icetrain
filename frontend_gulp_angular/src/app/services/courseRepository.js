/**
 * Created by Administrator on 18/05/2015.
 */
'use strict';

angular.module('iceApp')
.service('courseRepository',function($http,$q,authToken,auth, $cookieStore) {
    var API_URL = 'http://localhost:1337/'

    var getAuthHeader = function (uid){
      var token = authToken.getToken();
      if (token)
       return  'Bearer ' + token;
    };

    this.getCourseById = function (cid) {
      var url = API_URL + "course/" + cid;
      var headers = {
        clientkey: 'this is the client key',
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();
      $http.get(url, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.getCourseModules = function(course) {
      var API_URL = 'http://localhost:1337/';
      var cid = course.id;

      var url = API_URL + "courses/" + cid + "/modules/";
      var headers = {
        clientkey: 'this is the client key',
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();
      $http.get(url, {headers: headers})
        .then(function (res) {
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.createCourse = function(courseInfo, uid){
      var url = API_URL + "courses";
      var headers = {
        clientkey: 'this is the client key',
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();
      $http.post(url,courseInfo,{headers:headers})
        .then(function(res){
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.updateCourse = function (courseInfo, uid) {
      var url = API_URL + "course";
      var headers = {
        clientkey: 'this is the client key',
        uid:uid,
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();
      $http.put(url,courseInfo,{headers:headers})
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
        uid: uid,
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();

      $http.get(url, {headers: headers})
        .then(function (data) {
          console.log(data);
          dfd.resolve(data);
        });

      return dfd.promise;
    };

    this.deleteVideo = function(video,user){
      var urlToken = video.urltoken;
      var url = API_URL + 'delete-video/'+ user.id + "/" +  urlToken;
      var headers = {
        clientkey: 'this is the client key',
        uid: user.id,
        Authorization:getAuthHeader()
      };
      var dfd = $q.defer();
      $http.delete(url,{headers:headers}).then(function(res){
        dfd.resolve(res);
      });

      return dfd.promise;
    };

    this.deleteModule = function(module,user){
      var url = API_URL + 'module/' + module.id;
      var sessionToken = authToken.getToken();

      var headers = {
        clientkey: 'this is the client key',
        uid: user.id,
        Authorization:getAuthHeader()
      };
      var dfd = $q.defer();
      $http.delete(url,{headers:headers}).then(function(res){
        dfd.resolve(res);
      });

      return dfd.promise;
    };

    this.createModule = function(moduleInfo,courseInfo,user){
      var url = API_URL + 'module/';
      var sessionToken = authToken.getToken();

      var headers = {
        clientkey: 'this is the client key',
        uid: user.id,
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();

      $http.post(url,moduleInfo, {headers:headers})
        .then(function(res){
            dfd.resolve(res);
        });

      return dfd.promise;
    };

    this.updateModule = function(moduleInfo,courseInfo,user){
      var url = API_URL + 'module/' + moduleInfo.id;
      var sessionToken = authToken.getToken();

      var headers = {
        clientkey: 'this is the client key',
        uid: user.id,
        Authorization:getAuthHeader()
      };

      var dfd = $q.defer();
      $http.put(url, moduleInfo, {headers:headers})
        .then(function(res){
          console.log(res);
          dfd.resolve(res);
        });

      return dfd.promise;
    };
  });
