/**
 * Created by administrator on 05/09/2015.
 */
'use strict'
angular.module('iceApp').controller('SearchCtrl',function($scope, $location,$routeParams, courseRepository){

  var searchTerm = $routeParams.searchTerm;
  console.log(searchTerm);

  $scope.showEditor = false;
  courseRepository.findCourses(searchTerm).then(
    function(res){
      $scope.courses = res.data;
    },
    function(err){});
});
