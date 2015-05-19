/**
 * Created by Administrator on 18/05/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('CourseCtrl', function ($scope, $http,$location,auth, courseRepository) {

    $scope.editorEnable = false;

    var user = auth.currentUser();
    console.log(user.displayName);
    courseRepository.getUserCourses(user.id).then(function(res){
      if(res.status == 200) {
        $scope.courses = res.data;
      }
      else{
        $scope.errorMessage ='服务器错';
      }
    });


    $scope.createCourse = function(email, password) {


    };

  });
