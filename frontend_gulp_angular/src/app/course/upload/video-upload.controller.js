'use strict';

angular.module('iceApp').controller('VideoUploadCtrl',
  function($scope,$location,$log,$http,$routeParams,$timeout, auth,$window, Upload, relayService)
{
    var courseId = $routeParams.id;
    $scope.user = auth.currentUser();
    $scope.showVideoUploadDiv = false;
    var verb = 'get';
    var userid =  $scope.user ? $scope.user.id:-1;

    $scope.course = relayService.getKeyValue("course");
    $scope.module = relayService.getKeyValue("_uploadTo_module");

    var count =0;
    $scope.videoNames = {};//[];

    $scope.modalMessage = "上传完毕，返回课程"
    $scope.items = ['itme1', 'item2'];
    $scope.deleteModule = function (module) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'deleteClass.htm',
        controller: 'ModalInstanceCtrl',
        size: null,
        resolve: {
          modalMessage: function () {
            return $scope.modalMessage;
          }
        }
      });

      modalInstance.result.then(function (items) {
      });
    };

    // test function for modal dialog
    $scope.openDialog = function (module) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'deleteClass.htm',
        controller: 'ModalInstanceCtrl',
        size: null,
        resolve: {
          modalMessage: function () {
            return $scope.modalMessage;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
         alert( selectedItem );
      },function(){
        alert("dismissed ");
      });
    };

    $scope.showCourse = function(){
      var url = "/course/" + $scope.course.id;
      $location.path(url);
      $location.url(url);
    };
    $scope.uploadAll = function () {
      $scope.formUpload = false;

      if ($scope.files != null) {
        for (var i = 0; i < $scope.files.length; i++) {
          $scope.errorMsg = null;
          (function (file) {
            upload(file);
          })($scope.files[i]);
        }
      }
    };
    //$scope.$watch('files', function (files) {
    //  $scope.formUpload = false;
    //  if (files != null) {
    //    for (var i = 0; i < files.length; i++) {
    //      $scope.errorMsg = null;
    //      (function (file) {
    //        upload(file);
    //      })(files[i]);
    //    }
    //  }
    //});

    $scope.upload = function (file) {
      upload(file);
    };

    var upload = function(file) {
      $scope.errorMsg = null;
      $scope.howToSend = 1;
      if ($scope.howToSend === 1) {
        uploadUsingUpload(file);
      }
      else if ($scope.howToSend == 2) {
        uploadUsing$http(file);
      }
    };

    var uploadUsingUpload =function (file) {
      var index = $scope.files.indexOf(file);
      var videoName = $("#videoName_" + index).val();
      var duration =$("#duration_"+index).val();

      console.log(videoName);
      console.log(duration);

      var tutorId = $scope.module.tutor;
      var courseId = $scope.course.id;
      var moduleId = $scope.module.id;

      file.upload = Upload.upload({
        url: 'http://localhost:1337/' + tutorId + '/course/' + courseId + '/' + moduleId + "/videoUpload",
        method: 'POST',
        headers: {
          'clientkey': 'my-header-value'
        },
        data: {videoname: videoName,duration:duration},
        file: file,
        fileFormDataName: 'uploadFile'
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        console.dir("error" + response);
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });

      file.upload.success(function(data){
        $log.info('file upload finished ' + data);
        $scope.course.complexModules.forEach(function(m){
          if(m.id === data.module){
            if(!m.videoCollection) {
              m.videoCollection =[];
            }

            m.videoCollection.push(data);
          }
        });
        relayService.putKeyValue('course', $scope.course);
        count++;
        if(count === $scope.files.length){
          alert("all finished");
        }
      });

      file.upload.progress(function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function (xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    };

    var uploadUsing$http =function (file) {
      file.upload = Upload.http({
        url: 'http://localhost:1337/' + $scope.module.tutor + '/course/' + $scope.courseId + '/' + $scope.moduleId + "/videoUpload",
        //url: 'http://localhost:1337/upload' ,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',   //file.type,
          'clientkey': 'this is clientkey'
        },
        data: {username: $scope.username},
        file: file
      });

      file.upload.then(function (response) {
        file.result = response.data;
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    };

    angular.element(window).bind('dragover', function (e) {
      e.preventDefault();
    });
    angular.element(window).bind('drop', function (e) {
      e.preventDefault();
    });
  });

  angular.module('iceApp')
  .controller('ModalInstanceCtrl',
  [ '$scope','$modalInstance','modalMessage',function ($scope, $modalInstance, modalMessage ) {

  $scope.modalMessage = modalMessage;
  $scope.ok = function () {
    $modalInstance.close($scope);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
