//
//
//angular.module('icetraiFront')
//  .controller('CreateModuleCtrl',function($http,$scope, $routeParams, courseRepository, auth){
//
//    var courseId = $routeParams.id;
//    $scope.user = auth.currentUser();
//
//    $scope.showCourseInfoDiv =true;
//    $scope.showModuleDiv = false;
//    $scope.showAddModuleDiv = false;
//
//    courseRepository.getCourseById(courseId)
//      .then(function(res){
//        console.log(res.data);
//        if(res.status == 200) {
//          $scope.course = res.data;
//        }
//        else{
//          $scope.course = null;
//        };
//      });
//
//    $scope.submitCreateModuleForm = function(){
//
//      alert($scope.name);
//
//      var moduleInfo = {};
//      moduleInfo.name = $scope.name;
//      moduleInfo.desc =$scope.desc;
//      moduleInfo.tags =$scope.tags;
//      moduleInfo.course = $scope.course;
//      moduleInfo.tutor = $scope.course.tutor;
//
//      courseRepository.createModule(moduleInfo,$scope.course,$scope.user).
//        then(function(res){
//          console.log(res);
//        });
//
//    };
//  });
