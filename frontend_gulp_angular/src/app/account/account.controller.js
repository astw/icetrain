'use strict';

angular.module('icetraiFront')
  .controller('AccountCtrl', function ($scope, $http,$location,auth) {
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
  });
