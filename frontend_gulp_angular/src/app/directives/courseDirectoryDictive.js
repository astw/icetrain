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


