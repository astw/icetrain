/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, $http,$location,auth, courseRepository) {

    var MediaServer = "http://localhost:1337";
    $scope.vidoUrl = MediaServer + $location.url();

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





  });
