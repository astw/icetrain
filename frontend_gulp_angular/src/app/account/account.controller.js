'use strict';

angular.module('icetraiFront')
  .controller('AccountCtrl', function ($scope, $http,$location,auth,courseRepository) {

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

    $scope.login = function(email, password) {
      auth.login($scope.email, $scope.password).
        then(function(data){
          if(data.status == 200) {
            $scope.user = data.user;
            $location.path('/');
          }
          else
            $scope.loginFails = true;
        });
    };

    $scope.home = function(){
      var userId
    }
  });
