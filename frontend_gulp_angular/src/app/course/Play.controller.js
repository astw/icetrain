/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, $http,$location, $sce, auth, courseRepository) {

    var MediaServer = "http://localhost:1337";
    var sessionToken = auth.sessionToken();
    $scope.userLoggedIn = true;
    if(!sessionToken){
      $scope.userLoggedIn = false;
    };

    $scope.videoUrl = MediaServer + $location.url() +"?sessionToken=" + sessionToken;
    console.log('inside PlayCtrl');
    console.log($scope.videoUrl);

    //var url = API_URL + 'module/' + moduleInfo.id ;
    //
    //var headers = {
    //  clientkey: 'this is the client key',
    //  //uid: user.id,
    //  Authorization:sessionToken
    //};

    //var dfd = $q.defer();
    //$http.put(url, moduleInfo, {headers:headers})
    //  .then(function(res){
    //    console.log(res);
    //    dfd.resolve(res);
    //  });


  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  });
