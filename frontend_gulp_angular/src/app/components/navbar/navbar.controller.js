'use strict';

angular.module('icetraiFront')
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
  });
