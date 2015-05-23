

angular.module('icetraiFront')
.controller('CourseInfoCtrl',function($http,$scope, $routeParams, courseRepository, auth){

    var courseId = $routeParams.id;
    $scope.user = auth.currentUser();

    $scope.showCourseInfoDiv =true;
    $scope.showModuleDiv = false;
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
      $scope.verb = 'create';
    };

    $scope.submitCreateModuleForm = function(module) {

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
      $scope.verb = 'update';
    }
  });
