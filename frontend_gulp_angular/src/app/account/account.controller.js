'use strict';

angular.module('icetraiFront')
  .controller('AccountCtrl', function ($scope, $http,$location,auth,courseRepository) {
 
      $scope.submitSignupForm = function(){
        alert('submitSignupForm');
      }
  });
