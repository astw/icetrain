'use strict';

angular.module('icetraiFront')
  .controller('NavbarCtrl', function ($scope,auth, $http,$location) {
    $scope.date = new Date();
    $scope.isAuthenticated = auth.isAuthenticated();
    $scope.user = auth.currentUser();

    $scope.login = function() {
      auth.login($scope.email, $scope.password).
        then(function(data){
          if(data.status == 200) {
            $scope.user = data.user;
            $scope.isAuthenticated = auth.isAuthenticated();

            $location.path('/');
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
  });
