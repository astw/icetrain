'use strict'

var app = angular.module('icetraiFront');
app.directive('courseDirectory', function(){
   return {
     templateUrl:'app/course/partial/courseDirectory.html'
   };
});

app.directive('nextModule', function(){
  return {
    templateUrl:'app/course/partial/nextModule.html'
  };
});

app.directive("videoUpload",function(){
  return {
    templateUrl:'app/course/partial/videoUpload.html'
  }
});

app.directive("courseInfo",function(){
  return {
    templateUrl:'app/course/partial/courseInfo.html'
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
})

