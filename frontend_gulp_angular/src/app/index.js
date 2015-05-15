'use strict';

angular.module('icetraiFront', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', 'ui.bootstrap'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when("/reminder/xyz",{
        templateUrl:"app/reminder/reminder.html",
        controller:"ReminderCtrl"
      })
      .otherwise({
        redirectTo: '/'
      });
 
      $locationProvider.html5Mode(true);
  })
;
