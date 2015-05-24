'use strict';

angular.module('icetraiFront', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ngFileUpload'])
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
      .when('/account/signup',{
        templateUrl:"app/account/signup.html",
        controller:"AccountCtrl"
      })
      .when('/account/home',{
        templateUrl:"app/account/home.html",
        controller:'AccountCtrl'
      })
      .when('/course/create',{
        templateUrl:"app/course/createCourse.html",
        controller:"CourseCtrl"
      })
      .when('/course/uploadVideo',{
        templateUrl:"app/course/uploadVideo.html",
        controller:"VideoUploadCtrl"
      })
      .when('/course/:id',{
        templateUrl:"app/course/courseInfo.html",
        controller:"CourseInfoCtrl"
      })
      .when('/test',{
        templateUrl:"app/account/test.html",
        controller:"TestCtrl"
      })
      //.when('/video/upload',{
      //  templateUrl:"app/upload/index.html",
      //  controller:"UploadCtrl"
      //}).
      //when('/ngupload/',{
      //  templateUrl:"app/upload/ng-file.html",
      //  controller:"NgFileUploadCtrl"
      //})
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  })
;
