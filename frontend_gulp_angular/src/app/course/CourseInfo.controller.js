

angular.module('icetraiFront')
.controller('CourseInfoCtrl',function($http,$scope, $routeParams, courseRepository){

    var courseId = $routeParams.id;
    var editorEnable = false;

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

    $scope.createCourse = function(){
      alert("createCourse");
    };


    $scope.deleteCourse = function(){
      alert("deleteCourse");
    }


    $scope.editCourse = function(){
      alert("editCourse");
    }
  });
