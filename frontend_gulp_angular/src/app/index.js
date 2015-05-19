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
      .when('/account/login',{
        templateUrl:"app/components/navbar/login.html",
        controller:"NavbarCtrl"
      })
      .when('/account/logout',{
        templateUrl:"/",
        controller:"NavbarCtrl"
      })
      .when('/account/home',{
        templateUrl:"app/account/home.html",
        controller:'AccountCtrl'
      })
      .when('/course/create',{
        templateUrl:"app/course/createCourse.html",
        controller:"CourseCtrl"
      })
      .when('/course/:id',{
        templateUrl:"app/course/courseInfo.html",
        controller:"CourseInfoCtrl"
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  })
;
