

angular.module('icetraiFront')
.controller('CourseInfoCtrl',function($http,$scope, $routeParams, courseRepository, auth){
    alert('ddd');
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
        }
        else{
          $scope.course = null;
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
    };

    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });
    $scope.log = '';

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            fields: {
              'username': $scope.username
            },
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

            file.progress = progressPercentage ;
          }).success(function (data, status, headers, config) {

            $scope.$apply();
          });
        }
      }
    };
  });
