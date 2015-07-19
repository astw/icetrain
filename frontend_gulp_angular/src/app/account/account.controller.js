'use strict';

angular.module('iceApp')
  .controller('AccountCtrl', function ($scope, $http,$location,auth,courseRepository) {

      $scope.showCourseEditor = false;
      $scope.showMyCoursesList = true;

      $scope.submitSignupForm = function(){
        alert('submitSignupForm');
      };

    $scope.user = auth.currentUser();
      courseRepository.getUserCourses($scope.user.id).then(function(res){
       if(res.status == 200) {
         $scope.courses = res.data;
       }
       else{
         $scope.errorMessage ='服务器错';
       }
    });

    $scope.submitCreateCourseForm = function () {
      var courseInfo = {};
      courseInfo = $scope.course;

      courseRepository.createCourse(courseInfo,$scope.user.id)
        .then(function (res) {
          if (res.status == 201) {
            $scope.courses.push(res.data);
            $scope.showCourseEditor = false;
            $scope.showMyCoursesList = true;
          }
        });
    };

    $scope.submitUpdateCourseForm = function () {
      var courseInfo = {};
      courseInfo = $scope.course;

      courseRepository.updateCourse(courseInfo, $scope.course, $scope.user.id)
        .then(function (res) {
          if (res.status == 201) {
            $scope.courses.forEach(function(course){
              if(course.id === res.data.id){
                 course = res.data;
              }
            });

            $scope.showCourseEditor = false;
            $scope.showMyCoursesList = true;
          }
        });
    };

    $scope.createCourse = function(){
      $scope.showCourseEditor = true;
      $scope.showMyCoursesList = false;
      $scope.verb = 'create';
    };

    $scope.editCourse = function(course){
      $scope.showCourseEditor = true;
      $scope.showMyCoursesList = false;
      $scope.verb = 'update';
      $scope.course =course;
    };
    $scope.deleteCourse = function(course){
      var courseInfo = {};
      courseInfo = $scope.course;
      courseRepository.deleteCourse(course,$scope.user.id)
        .then(function (res) {
          console.log(res);
        });
    };

    $scope.showMyCourses = function(){
      $scope.showCourseEditor = false;
      $scope.showMyCoursesList = true;
    }
  });
