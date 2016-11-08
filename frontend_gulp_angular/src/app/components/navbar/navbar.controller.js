'use strict';

angular.module('iceApp')
  .controller('NavbarCtrl', function ($scope,auth, $http,$location,$routeParams, watchHistoryService) {
    $scope.date = new Date();
    $scope.isAuthenticated = auth.isAuthenticated();
    $scope.user = auth.currentUser();
    $scope.login = function() {
      auth.login($scope.email, $scope.password).
        then(function(res){
          if(res.status == 200) {
            $scope.user = res.data.user;
            $scope.isAuthenticated = auth.isAuthenticated();

            var transfer = $location.search().transfer;
            if(transfer){
              $location.url(transfer);
            }
            else
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
    $scope.checkEmail = function(){
       auth.checkEmailExistance($scope.email).
        then(function(res){
          if(res.status == 200) {
            $scope.emailExists = (res.data === 'true');
          }
          else
            $scope.emailExists = false;
        });
    };

    $scope.search =  function(term){
      $location.url('/search/' + term);
    };

    $scope.register = function(){
      auth.register($scope.email, $scope.userName, $scope.password,$scope.password2).
        then(function(res){
          if(res.status == 200) {
            $scope.user = res.data.user;
            $scope.isAuthenticated = auth.isAuthenticated();
            $location.url('/');
          }
          else{
            $scope.loginFails = true;
          }
        },

        function(err){
          $scope.loginFails = true;
        }
      );
    }

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  });
