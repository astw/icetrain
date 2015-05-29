'use strict';

angular.module('icetraiFront')
  .controller('VideoUploadCtrl',

    function($scope, $http, $timeout,$routeParams, $compile, Upload) {
      $scope.tutorId = $routeParams.tutorId;
      $scope.moduleId =$routeParams.moduleId;
      $scope.courseId = $routeParams.courseId;
      alert($scope.courseId);

    ///  /tutorId:/course/:courseId/moduleId/videoUpload


    $scope.$watch('files', function(files) {
    $scope.formUpload = false;
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        $scope.errorMsg = null;
        (function(file) {
          upload(file);
        })(files[i]);
      }
    }
  });

     $scope.uploadPic = function(files) {
      $scope.formUpload = true;
      if (files != null) {
        upload(files[0])
      }
    };

  function upload(file) {


    $scope.errorMsg = null;
    $scope.howToSend = 1;
    if ($scope.howToSend === 1) {
      uploadUsingUpload(file);
    } else if ($scope.howToSend == 2) {
      uploadUsing$http(file);
    }
  }

  function uploadUsingUpload(file) {
    file.upload = Upload.upload({
      url: 'http://localhost:1337/'+$scope.tutorId+'/course/'+$scope.courseId +'/'+$scope.moduleId+"/videoUpload",
      //url:'http://localhost:1337/file/upload',
      ///:userid/video/:courseid/sectionid/upload
      method: 'POST',
      headers: {
        'clientkey' : 'my-header-value'
      },
      fields: {username: $scope.username},
      file: file,
      fileFormDataName: 'myFile'
    });

    file.upload.then(function(response) {
      console.log('----- return from server');
      console.log(response);
      $timeout(function() {
        file.result = response.data;
      });
    }, function(response) {
      console.dir("error" + response);
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {

      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }

  function uploadUsing$http(file) {
    file.upload = Upload.http({
      url: 'http://localhost:1337/upload' ,
      method: 'POST',
      headers : {
        'Content-Type': 'multipart/form-data',   //file.type,
        'clientkey':'this is clientkey'
      },
      data:{username: $scope.username},
      file: file
    });

    file.upload.then(function(response) {
      file.result = response.data;
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    });

    file.upload.progress(function(evt) {
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }

  angular.element(window).bind('dragover', function(e) {
    e.preventDefault();
  });
  angular.element(window).bind('drop', function(e) {
    e.preventDefault();
  });

  });
//
//angular.module('icetraiFront')
//     .controller('VideoUploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
//
//      $scope.$watch('files', function () {
//        $scope.upload($scope.files);
//      });
//      $scope.log = '';
//
//      $scope.upload = function (files) {
//        if (files && files.length) {
//          for (var i = 0; i < files.length; i++) {
//            var file = files[i];
//            file.upload = Upload.http({
//          //    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//              url: 'http://localhost:1337/upload' ,
//              method: 'POST',
//              headers : {
//                'Content-Type': file.type
//              },
//              data: file
//            });
//
//            file.upload.then(function(response) {
//              file.result = response.data;
//            }, function(response) {
//              if (response.status > 0)
//                $scope.errorMsg = response.status + ': ' + response.data;
//            });
//
//            file.upload.progress(function(evt) {
//              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//            });
//          }
//        }
//      };
//    }]);
