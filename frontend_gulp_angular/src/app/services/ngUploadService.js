/////**
//// * Created by Shuhao Wang on 30/05/2015.
//// */
//
//
//'use strict';
//
//angular.module('iceApp')
//  .service('ngUploadService',function($http,$q,authToken,auth, $cookieStore) {
//    var API_URL = 'http://localhost:1337/'
//    var formUpload = false;
//
//    this.init = function () {
//      angular.element(window).bind('dragover', function (e) {
//        e.preventDefault();
//      });
//      angular.element(window).bind('drop', function (e) {
//        e.preventDefault();
//      });
//    };
//      this.watchFileDrop = function (files) {
//
//        $scope.$watch('files', function (files) {
//          formUpload = false;
//          if (files != null) {
//            for (var i = 0; i < files.length; i++) {
//              $scope.errorMsg = null;
//              (function (file) {
//                upload(file);
//              })(files[i]);
//            }
//          }
//        });
//      };
//
//      this.uploadPic = function(files) {
//        formUpload = true;
//        if (files != null) {
//          upload(files[0])
//        }
//      };
//
//    this.upload = function(file) {
//      var howToSend = 1;
//      if (howToSend === 1) {
//        uploadUsingUpload(file);
//      } else if (howToSend == 2) {
//        uploadUsing$http(file);
//      }
//    };
//
//    this.uploadUsingUpload = function (file) {
//        file.upload = Upload.upload({
//          url: 'http://localhost:1337/' + $scope.tutorId + '/course/' + $scope.courseId + '/' + $scope.moduleId + "/videoUpload",
//          method: 'POST',
//          headers: {
//            'clientkey': 'my-header-value'
//          },
//          //  fields: {username: $scope.username},
//          data: {'videoname': 'this is the videoname'},
//          file: file,
//          fileFormDataName: 'uploadFile'
//        });
//
//        file.upload.then(function (response) {
//          $timeout(function () {
//            file.result = response.data;
//          });
//        }, function (response) {
//          console.dir("error" + response);
//          if (response.status > 0)
//            $scope.errorMsg = response.status + ': ' + response.data;
//        });
//
//        file.upload.progress(function (evt) {
//          // Math.min is to fix IE which reports 200% sometimes
//          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//        });
//
//        file.upload.xhr(function (xhr) {
//          // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
//        });
//      }
//
//    this.uploadUsing$http = function (file) {
//        file.upload = Upload.http({
//          url: 'http://localhost:1337/' + $scope.tutorId + '/course/' + $scope.courseId + '/' + $scope.moduleId + "/videoUpload",
//          //url: 'http://localhost:1337/upload' ,
//          method: 'POST',
//          headers: {
//            'Content-Type': 'multipart/form-data',   //file.type,
//            'clientkey': 'this is clientkey'
//          },
//          data: {username: $scope.username},
//          file: file
//        });
//
//        file.upload.then(function (response) {
//          file.result = response.data;
//        }, function (response) {
//          if (response.status > 0)
//            $scope.errorMsg = response.status + ': ' + response.data;
//        });
//
//        file.upload.progress(function (evt) {
//          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//        });
//      }
//  });
