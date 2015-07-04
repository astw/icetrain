/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope,relayService, $http,$location, $sce, auth, courseRepository) {
    var MediaServer = "http://localhost:1337";
    var sessionToken = auth.sessionToken();
    $scope.userLoggedIn = true;
    if(!sessionToken){
      $scope.userLoggedIn = false;
    };

    $scope.videoUrl = MediaServer + $location.url() +"?sessionToken=" + sessionToken;

    $scope.course =  relayService.getKeyValue('course');
    $scope.modules = $scope.course.complexModules;
    $scope.currentVideoPlayUrl = "";

    $scope.select = function(module){
         module.show = true;
    };
    $scope.showModule = function(module){
       return  !module.show  ;//& tab.mouseOver;
    };

    $scope.moduleClick = function(module){
      if(!module.show){
        module.show = true;
      }
      else
        module.show = false;
    };

    $scope.getVideoClass = function(video){
       if(video.current)
           return " current watched";
      else
          return " "
    };

    $scope.videoClicked = function(modules, video){

      for(var m =0; m <$scope.modules.length; m++) {
        var module = modules[m];
        for (var i = 0; i < module.videoCollection.length; i++) {
          module.videoCollection[i].current = false;
        }
      }
      video.current = true;
      $scope.videoUrl = MediaServer + "/mediaServer/video/stream/" + video.urltoken  +"?sessionToken=" + sessionToken;

      var player = $(event.target).closest('#palyerBorder').find('#example_video_html5_api');
      player.attr('src',$scope.videoUrl);
      player.load();

      relayService.putKeyValue('course',$scope.course);
    };


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
