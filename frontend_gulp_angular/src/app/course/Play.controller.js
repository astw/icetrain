/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, $http,$location, $sce, auth, courseRepository) {

    var MediaServer = "http://localhost:1337";
    $scope.videoUrl = MediaServer + $location.url();
    console.log('inside PlayCtrl');
    console.log($scope.videoUrl);


    //var url = API_URL + 'module/' + moduleInfo.id;
    //var sessionToken = authToken.getToken();
    //
    //var headers = {
    //  clientkey: 'this is the client key',
    //  uid: user.id,
    //  Authorization:getAuthHeader()
    //};
    //
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
