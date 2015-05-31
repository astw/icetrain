

angular.module('icetraiFront')
.controller('CourseInfoCtrl',function($http,$scope, $routeParams,$location,$timeout, Upload,  courseRepository, auth,relayService){

    var courseId = $routeParams.id;
    $scope.user = auth.currentUser();

    $scope.showCourseInfoDiv =true;
    $scope.showModuleDiv = false;
    $scope.showVideoUploadDiv = false;
    var verb ='get';

    courseRepository.getCourseById(courseId)
      .then(function(res){
        console.log(res.data);
        if(res.status == 200) {
          $scope.course = res.data;
          relayService.put(res.data);
        }
        else{
          $scope.course = null;
          relayService.put(null);
        };
      });

    $scope.toggleModule = function(module){
      module.show = !module.show;
    };

    $scope.getEnabledClassIfAuthorized =function(userMayViewFirstClip){

    };

    $scope.createModule = function(){
      $scope.showCourseInfoDiv =false;
      $scope.showModuleDiv = true;
      $scope.showVideoUploadDiv = false;
      $scope.verb = 'create';
    };

    $scope.submitCreateModuleForm = function() {

      var moduleInfo = {};
      moduleInfo.name = $scope.name;
      moduleInfo.desc = $scope.desc;
      moduleInfo.tags = $scope.tags;
      moduleInfo.course = $scope.course;
      moduleInfo.tutor = $scope.course.tutor;

      courseRepository.createModule(moduleInfo, $scope.course, $scope.user)
        .then(function (res) {
          if (res.status == 201) {
            $scope.showCourseInfoDiv = true;
            $scope.showModuleDiv = false;
            $scope.showVideoUploadDiv = false;
            $scope.course.modules.push(res.data);
          }
        });
    };

    $scope.submitUpdateModuleForm = function() {
      $currentCourse.name = $scope.name;
      $currentCourse.desc = $scope.desc;
      $currentCourse.tags = $scope.tags;

      courseRepository.updateModule($currentCourse, $scope.course, $scope.user)
        .then(function (res) {
          if (res.status == 200) {
            $scope.showCourseInfoDiv = true;
            $scope.showModuleDiv = false;
            $scope.showVideoUploadDiv = false;
          }
        });
    };

    $scope.deleteModule = function(module){
      courseRepository.deleteModule(module,$scope.user).
        then(function(res){
            var idx = $scope.course.modules.indexOf(module);
            $scope.course.modules.splice(idx,1);
        });
    };

    $scope.editModule = function(module){
      $scope.name = module.name;
      $scope.desc = module.desc;
      $scope.tags = module.tags;

      $currentCourse = module;

      $scope.showCourseInfoDiv = false;
      $scope.showModuleDiv = true;
      $scope.showVideoUploadDiv = false;
      $scope.verb = 'update';
    };

    $scope.addVideos = function(module){
      $scope.showCourseInfoDiv = false;
      $scope.showModuleDiv = false;
      $scope.showVideoUploadDiv = true;
      $scope.module = module;
      relayService.put(module);


      var url ="/" + $scope.course.tutor.id + "/course/" + $scope.course.id + "/" + module.id+ "/videoUpload";
     // $location.url(url);
    };


    $scope.uploadAll = function(){
      $scope.formUpload = false;
        if ($scope.files != null) {
          for (var i = 0; i < $scope.files.length; i++) {
            $scope.errorMsg = null;
            (function (file) {
              upload(file);
            })($scope.files[i]);
          }
        }
    },

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

    $scope.uploadPic = function (files) {
      $scope.formUpload = true;
      if (files != null) {
        upload(files[0])
      }
    };

    $scope.upload = function(file){
      upload(file);
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
      var tutorId = $scope.course.tutor.id;
      var courseId = $scope.course.id;
      var moduleId = $scope.module.id;

      file.upload = Upload.upload({
        url: 'http://localhost:1337/' + tutorId + '/course/' + courseId + '/' + moduleId + "/videoUpload",
        method: 'POST',
        headers: {
          'clientkey': 'my-header-value'
        },
        data: {videoname: 'this is the videoname'},
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

      file.upload.progress(function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function (xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    }

    function uploadUsing$http(file) {
      file.upload = Upload.http({
        url: 'http://localhost:1337/' + $scope.tutorId + '/course/' + $scope.courseId + '/' + $scope.moduleId + "/videoUpload",
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
    }

    angular.element(window).bind('dragover', function (e) {
      e.preventDefault();
    });
    angular.element(window).bind('drop', function (e) {
      e.preventDefault();
    })

  });
