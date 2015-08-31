'use strict';

angular.module('iceApp')
  .controller('AccountCtrl', function ($scope, $http,$location,$modal,auth,courseRepository) {

      $scope.showCourseEditor = false;
      $scope.showMyCoursesList = true;
      $scope.message="";
      $scope.error = false;

      $scope.submitSignupForm = function(){
        alert('submitSignupForm');
      };

    $scope.user = auth.currentUser();
    if($scope.user) {
      courseRepository.getUserCourses($scope.user.id).then(function (res) {
        if (res.status == 200) {
          $scope.courses = res.data;
        }
        else {
          $scope.errorMessage = '服务器错';
        }
      });
    }
    $scope.InputChange = function(){
       $scope.message ="";
       $scope.error = false;
    }

    $scope.submitCreateCourseForm = function () {
      var courseInfo = {};
      courseInfo = $scope.course;

      courseRepository.createCourse(courseInfo,$scope.user.id)
        .then(function (res) {
          if (res.status == 201) {
            $scope.courses.push(res.data);
            $scope.showCourseEditor = false;
            $scope.showMyCoursesList = true;
          }
        });
    };

    $scope.submitUpdateCourseForm = function () {
      var courseInfo = {};
      courseInfo = $scope.course;
      var uid = $scope.user.id;

      courseRepository.updateCourse(courseInfo, uid)
        .then(
          function (res) {
          if (res.status == 200) {
            $scope.courses.forEach(function(course){
              if(course.id === res.data.id){
                 course = res.data;
              }
            });

            $scope.showCourseEditor = false;
            $scope.showMyCoursesList = true;
          }
        },
        function(err){
          $scope.error = true;
          $scope.message = err.statusText;
        });
    };

    $scope.createCourse = function(){
      $scope.showCourseEditor = true;
      $scope.showMyCoursesList = false;
      $scope.verb = 'create';
    };

    $scope.editCourse = function(course){
      $scope.showCourseEditor = true;
      $scope.showMyCoursesList = false;
      $scope.verb = 'update';
      $scope.course =course;
    };
    $scope.deleteCourse = function(course){

      $scope.modalMessage = "确定要删除这课吗？"
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/course/partial/modal-dialog.html',
        controller: 'ModalInstanceCtrl',
        size: null,
        resolve: {
          modalMessage: function () {
            return $scope.modalMessage;
          }
        }
      });

      var courseInfo = {};
      courseInfo = $scope.course;
        modalInstance.result.then(function (items) {
        courseRepository.deleteCourse(course,$scope.user.id)
          .then(function (res) {
            var index = $scope.courses.indexOf(course);
            $scope.courses.splice(index,1);
          });

      }, function (data) {
        console.log('return from delete course');
      })
    };

    $scope.showMyCourses = function(){
      $scope.showCourseEditor = false;
      $scope.showMyCoursesList = true;
    }
  });

angular.module('iceApp')
  .controller('ModalInstanceCtrl',
  [ '$scope','$modalInstance','modalMessage',function ($scope, $modalInstance, modalMessage ) {

    $scope.modalMessage = modalMessage;
    $scope.ok = function () {
      $modalInstance.close($scope);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
