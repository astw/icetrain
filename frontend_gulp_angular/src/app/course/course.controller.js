/**
 * Created by Administrator on 18/05/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('CourseCtrl', function ($scope, $http,$location,auth, courseRepository) {

    $scope.editorEnable = false;

    var user = auth.currentUser();
    console.log(user.displayName);
    courseRepository.getUserCourses(user.id).then(function onSuccess(res){
       res.data.forEach(function(course){
           courseRepository.getCourseModules(course).then(function(modules){
             course.modules = modules;
           });
       });

        $scope.courses = res.data;

    })
    .catch(function onError(res){
      console.log(res);
    })
    .finally(function eitherWay(){
      console.log("either way");
    });

    $scope.createCourse = function(email, password) {


    };

    $scope.uploadVideo = function(files){
      alert(files);
    }

  });
