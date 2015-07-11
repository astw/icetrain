

angular.module('icetraiFront')
.controller('CourseInfoCtrl',function($http, $rootScope, $scope, $routeParams,$location,$timeout,
                                      Upload,
                                      courseRepository,
                                      watchHistoryService,
                                      auth,relayService,$modal) {

    var courseId = $routeParams.id;
    $scope.user = auth.currentUser();
    $scope.showCourseInfoDiv = true;
    $scope.showModuleEditor = false;
    $scope.showVideoUploadDiv = false;
    var verb = 'get';
    var userid = $scope.user.id;

    $scope.videoNames = [0, 1, 2];

    courseRepository.getCourseById(courseId)
      .then(function (res) {
        if (res.status == 200) {
          if (res.data.modules == null || res.data.modules.length == 0) {
            res.data.modules = [];
            res.data.complexModules = [];
            $scope.course = res.data;
          }
          res.data.modules.forEach(function (module) {
            console.log(module.vidoes);
            courseRepository.getCourseModules(res.data).then(function (moduleRes) {
              res.data.complexModules = moduleRes.data;
              console.log(res.data.complexModules);
              $scope.course = res.data;
              relayService.putKeyValue('course', $scope.course);
              console.log(res.data);
            });
          });
          $scope.course = res.data;
          relayService.put(res.data);
        }
        else {
          $scope.course = null;
          relayService.put(null);
        }
        ;
      });

    watchHistoryService.getUserCourseWatchHistory(userid, courseId).then(function (res) {
      if (res.status == 200) {
        $scope.watchHistory = res.data;
        var cacheKey = 'userid_' + userid + "_courseid_" + courseId;
        relayService.putKeyValue(cacheKey, $scope.watchHistory);
      }
    });


    $scope.toggleModule = function (module) {
      module.show = !module.show;
    };

    $scope.getEnabledClassIfAuthorized = function (userMayViewFirstClip) {
    };

    $scope.createModule = function () {
      $scope.showCourseInfoDiv = false;
      $scope.showModuleEditor = true;
      $scope.showVideoUploadDiv = false;
      $scope.verb = 'create';
    };

    $scope.submitCreateModuleForm = function () {

      var moduleInfo = {};
      moduleInfo.name = $scope.name;
      moduleInfo.desc = $scope.desc;
      moduleInfo.tags = $scope.tags;
      moduleInfo.course = $scope.course;
      moduleInfo.tutor = $scope.course.tutor;

      courseRepository.createModule(moduleInfo, $scope.course, $scope.user)
        .then(function (res) {
          if (res.status == 201) {
            $scope.course.complexModules.push(res.data);
            $scope.showCourseInfoDiv = true;
            $scope.showModuleEditor = false;
            $scope.showVideoUploadDiv = false;
          }
        });
    };

    $scope.submitUpdateModuleForm = function () {
      $currentCourse.name = $scope.name;
      $currentCourse.desc = $scope.desc;
      $currentCourse.tags = $scope.tags;

      courseRepository.updateModule($currentCourse, $scope.course, $scope.user)
        .then(function (res) {
          if (res.status == 200) {
            $scope.showCourseInfoDiv = true;
            $scope.showModuleEditor = false;
            $scope.showVideoUploadDiv = false;
          }
        });
    };

    $scope.modalMessage = "确定要删除这一节吗？"
    $scope.items = ['itme1', 'item2'];
    $scope.deleteModule = function (module) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: "deleteClass.htm",
        controller: "ModalInstanceCtrl",
        size: null,
        resolve: {
          modalMessage: function () {
            return $scope.modalMessage;
          }
        }
      });

      modalInstance.result.then(function (items) {
        courseRepository.deleteModule(module, $scope.user).
          then(function (res) {
            var idx = $scope.course.complexModules.indexOf(module);
            $scope.course.complexModules.splice(idx, 1);
            // for(var i=0 ;i<$scope.course.modules; i++){
            //   if($scope.course.modules[i].id == module.id)
            //   {
            //     $scope.course.modules.splice(0,1);
            //   }
            // }
          });

      }, function () {

      });
    };

    $scope.editModule = function (module) {
      $scope.name = module.name;
      $scope.desc = module.desc;
      $scope.tags = module.tags;

      $currentCourse = module;

      $scope.showCourseInfoDiv = false;
      $scope.showModuleEditor = true;
      $scope.showVideoUploadDiv = false;
      $scope.verb = 'update';
    };

    $scope.addVideos = function (module) {
      $scope.showCourseInfoDiv = false;
      $scope.showModuleEditor = false;
      $scope.showVideoUploadDiv = true;
      $scope.module = module;
      relayService.put(module);
      var url = "/" + $scope.course.tutor.id + "/course/" + $scope.course.id + "/" + module.id + "/videoUpload";
      // $location.url(url);
    };

    $scope.deleteVideo = function (video) {
      courseRepository.deleteVideo(video, $scope.user).then(function (res) {
        console.log(res);
      });
    };

    $scope.bookMark = function (video) {
      courseRepository.deleteVideo(video, $scope.user).then(function (res) {
        console.log(res);
      });
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

    $scope.showCourse = function () {
      $scope.showCourseInfoDiv = true;
      $scope.showModuleEditor = false;
      $scope.showVideoUploadDiv = false;
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

    $scope.toggleShowValue = function () {
      $scope.showCourseInfoDiv = !$scope.showCourseInfoDiv;
      $scope.showModuleEditor = !$scope.showModuleEditor;
      $scope.showVideoUploadDiv = ! $scope.showVideoUploadDiv;
    };

    $scope.uploadPic = function (files) {
      $scope.formUpload = true;
      if (files != null) {
        upload(files[0])
      }
    };

    $scope.upload = function (file) {
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
      var index = $scope.files.indexOf(file);

      var tutorId = $scope.course.tutor.id;
      var courseId = $scope.course.id;
      var moduleId = $scope.module.id;

      file.upload = Upload.upload({
        url: 'http://localhost:1337/' + tutorId + '/course/' + courseId + '/' + moduleId + "/videoUpload",
        method: 'POST',
        headers: {
          'clientkey': 'my-header-value'
        },
        data: {videoname: $scope.videoNames[index]},
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
    });
  });

angular.module('icetraiFront')
  .controller('ModalInstanceCtrl',['$modalInstance', function ($scope, $modalInstance, modalMessage ) {

  $scope.modalMessage = modalMessage;
  $scope.ok = function () {
    $modalInstance.close($scope);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
