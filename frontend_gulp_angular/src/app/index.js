'use strict';

angular.module('iceApp',
  ['ngAnimate', 'ngCookies',
  'ngTouch', 'ngSanitize',
  'ngResource', 'ngRoute',
  'ui.bootstrap', 'ngFileUpload'
  ]
)
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
      .when('/account/register',{
        templateUrl:"app/components/navbar/signup.html",
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
        templateUrl:"app/course/course.html",
        controller:"CourseCtrl"
      })
      .when('/mediaServer/video/stream/:token',{
        templateUrl:"app/course/play.html",
        controller:"PlayCtrl"
      })
      .when('/example',{
        templateUrl:"app/example/example.html",
        controller:"ModalDemoCtrl"
      })
      .when('/test',{
        templateUrl:"app/course/addVideo.html",
        controller:"TestCtrl"
      })
      .when('/video/upload',{
        templateUrl:"app/course/upload/video-upload.html",
        controller:"VideoUploadCtrl"
      })
      .when('/search/:searchTerm',{
        templateUrl:"app/search/search-result.html",
        controller:"SearchCtrl"
      })
      .when('/fabric/test',{
        templateUrl:"app/fabric/test.html",
        controller:"FabricCtrl"
      })
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
