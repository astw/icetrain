'use strict';

angular.module('iceApp')
  .controller('NavbarCtrl', function ($scope,auth, $http,$location) {
    $scope.date = new Date();
    $scope.isAuthenticated = auth.isAuthenticated();
    $scope.user = auth.currentUser();
    $scope.login = function() {
      auth.login($scope.email, $scope.password).
        then(function(res){
          if(res.status == 200) {
            $scope.user = res.data.user;
            $scope.isAuthenticated = auth.isAuthenticated();
            $location.url('/');
          }
          else
            $scope.loginFails = true;
        });
    };

    $scope.logout = function() {
      auth.logout();
      $scope.username = "";
      $scope.user = "";
      $scope.password = "";
      $scope.isAuthenticated = auth.isAuthenticated();
      $location.path('/');
    }

    $scope.password2Chang = function(){
      $scope.passwordNotMatch = $scope.password2 != $scope.password;
    };

    $scope.register = function(){
      auth.register($scope.email, $scope.password,$scope.password2).
        then(function(res){ 
          if(res.status == 200) {
            $scope.user = res.data.user;
            $scope.isAuthenticated = auth.isAuthenticated();
            $location.url('/');
          }
          else
            $scope.loginFails = true;
        });
    }

  });
