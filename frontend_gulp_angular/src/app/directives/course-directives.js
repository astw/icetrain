'use strict';

var app = angular.module('iceApp');
app.directive('courseDirectory', function(){
   return {
     templateUrl:'app/course/partial/course-directory.html'
   };
});

app.directive('nextModule', function(){
  return {
    templateUrl:'app/course/partial/next-module.html'
  };
});

app.directive("videoUpload",function(){
  return {
    templateUrl:'app/course/partial/video-upload.html'
  }
});

app.directive("courseInfo",function(){
  return {
    templateUrl:'app/course/partial/course-info.html'
  }
});

app.directive("courseExtraInfo",function(){
  return {
    templateUrl:"app/course/partial/course-extra-info.html"
  }
});

app.directive("moduleEditor",function(){
  return{
    templateUrl:'app/course/partial/module-editor.html'
  }
});

app.directive("modulesList",function(){
  return {
    templateUrl:'app/course/partial/modules-list.html'
  }
});

app.directive("courseEditor",function(){
  return {
    templateUrl:'app/course/partial/course-editor.html'
  }
});

app.directive("myCoursesList",function(){
  return {
    templateUrl:'app/course/partial/my-courses-list.html'
  }
});

