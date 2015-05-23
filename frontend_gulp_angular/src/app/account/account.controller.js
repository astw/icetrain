'use strict';

angular.module('icetraiFront')
  .controller('AccountCtrl', function ($scope, $http,$location,auth,courseRepository) {

      $scope.submitSignupForm = function(){
        alert('submitSignupForm');
      }

     var user = auth.currentUser();
    courseRepository.getUserCourses(user.id).then(function(res){
      console.log(res);
       if(res.status == 200) {
         $scope.courses = res.data;
       }
       else{
         $scope.errorMessage ='服务器错';
       }
    });
  });
