
angular.module('iceApp')
  .controller('CourseCtrl',function($http, $rootScope, $scope, $routeParams,$location,$timeout,
                                      Upload,$window,
                                      courseRepository,
                                      watchHistoryService,
                                      auth,relayService,
                                      $modal, $log
  )
  {
    var courseId = $routeParams.id;
    $scope.user = auth.currentUser();
    $scope.showCourseInfoDiv = true;
    $scope.showModuleEditor = false;
    var verb = 'get';
    var userid =  $scope.user ? $scope.user.id:-1;
    var count =0;
    $scope.showEditor = false;

    courseRepository.getCourseById(courseId)
      .then(function (res) {
        if (res.status == 200) {
          if(userid > 0 && res.data && res.data.tutor && res.data.tutor.id === userid){
            $scope.showEditor = true;
            console.log($scope.showEditor);
          }

          if (res.data.modules == null || res.data.modules.length == 0) {
            res.data.modules = [];
            res.data.complexModules = [];
            $scope.course = res.data;
          }
          res.data.modules.forEach(function (module) {
            console.log(module.vidoes);
            courseRepository.getCourseModules(res.data).then(function (moduleRes) {
              res.data.complexModules = [].concat(moduleRes.data);
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
      })
      .catch(function onError(res){
        console.log(res);
      })
      .finally(function eitherWay(){
        console.log("either way");
      });

    watchHistoryService.getUserCourseWatchHistory(userid, courseId).then(function (res) {
      if (res.status == 200) {
        $scope.watchHistory = [].concat(res.data);
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
      alert('update module');
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
          else{
            alert(res.status);
          }
        });
    };

    $scope.deleteModule = function (module) {

      $scope.modalMessage = "确定要删除这一节吗？"
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/course/partial/modal-dialog.html',
        controller: 'ModalInstanceCtrl',
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
            $scope.course.duration -= module.duration;
            $scope.course.complexModules.splice(idx, 1);
            for(var i=0 ;i<$scope.course.modules; i++){
               if($scope.course.modules[i].id == module.id)
               {
                 $scope.course.modules.splice(i,1);
                 break;
               }
            }
            relayService.putKeyValue('course', $scope.course);
            $scope.safeApply();
          });

      }, function (data) {
        console.log('return from delete');
         console.log(data);
      })
    };

    // test function for modal dialog
    $scope.openDialog = function (module) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '',
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
      relayService.put(module);
      relayService.putKeyValue("_uploadTo_module", module);
      var url ="/video/upload";
      $location.path(url);
    };

    $scope.deleteVideo = function (module,video) {
      if(userid < 0) return ;
      $scope.modalMessage = "确定要删除这一段视频吗？"
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/course/partial/modal-dialog.html',
        controller: 'ModalInstanceCtrl',
        size: null,
        resolve: {
          modalMessage: function () {
            return $scope.modalMessage;
          }
        }
      });

      modalInstance.result.then(function (items) {
        courseRepository.deleteVideo(video, $scope.user).then(function (res) {
          var idx = module.videoCollection.indexOf(video);
          module.videoCollection.splice(idx, 1);
          module.duration -= video.duration;
          $scope.module = module;
          $scope.course.duration -= video.duration;
          relayService.putKeyValue('course', $scope.course);
          $log.info('delete ' + video);
        });
      }, function (data) {
        console.log('return from delete video');
        console.log(data);
      })
    };

    $scope.playMe = function(video){
      console.log(video);
      var playUrl ='/mediaServer/video/stream/' + video.urltoken;

      if(userid > 0){
        $location.url(playUrl);
      }
      else{
        $location.url('/account/login?transfer='+ playUrl);
      }
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
    };

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
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
  }]);
