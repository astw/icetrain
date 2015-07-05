/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, relayService, $http, $location, $sce, auth, courseRepository) {
    var MediaServer = "http://localhost:1337";
    var sessionToken = auth.sessionToken();

    $scope.showVideoPlayer = true;
    $scope.userLoggedIn = true;
    if (!sessionToken) {
      $scope.userLoggedIn = false;
    }
    ;
    $scope.videoUrl = MediaServer + $location.url() + "?sessionToken=" + sessionToken;

    $scope.course = relayService.getKeyValue('course');
    $scope.modules = $scope.course.complexModules;

    $scope.select = function (module) {
      module.show = true;
      $scope.currentModule = module;
    };
    $scope.showModule = function (module) {
      return !module.show;
    };

    $scope.moduleClick = function (module) {
      if (!module.show) {
        module.show = true;
      }
      else
        module.show = false;
    };

    $scope.getVideoClass = function (video) {
      if (video.current)
        return " current watched";
      else
        return " "
    };

    $scope.videoClicked = function (module, video) {
      $scope.modules.forEach(function (m) {
        m.videoCollection.forEach(function (v) {
          v.current = false;
        })
      });

      $scope.showNextModule = false;
      $scope.showVideoPlayer = true;
      $scope.currentModule = module;
      video.current = true;
      $scope.videoUrl = getVideoUrl(video);
      var player = getVideoPlayer();
      player.attr('src', $scope.videoUrl);
      player.load();
      player.bind('ended', function () {
        var nextVideo = getNextVideoUrl(module, video, player);
        if (!nextVideo) {
          return;
        }
      });

      showPlayer(player);
      $scope.safeApply();
      relayService.putKeyValue('course', $scope.course);
    };

    $scope.playNextModule = function () {

      var idx = $scope.modules.indexOf($scope.currentModule);
      if (idx < $scope.modules.length - 1) {
        var module = $scope.modules[idx + 1];
        $scope.select(module);
        $scope.currentModule.active = false;
        module.active = true;
        if (module.videoCollection.length > 0) {
          var video = module.videoCollection[0];
          $scope.videoClicked(module, video);
        }
      }
      else {
        // end of this class
        // player.attr('style',"visibility:hidden");
      }
    };

    var getNextVideoUrl = function (module, currentVideo, player) {
      var idx = module.videoCollection.indexOf(currentVideo);
      if (idx < module.videoCollection.length - 1) {
        var video = module.videoCollection[idx + 1];
        $scope.videoClicked(module, video);
        return video;
      }
      else {
        // end of this module
        // reminder user click to watch next module

        player.attr('style', "visibility:hidden");
        $scope.showVideoPlayer = false;
        $scope.showNextModule = true;
        $scope.$applyAsync();
        return null;
      }
    };

    var hidePlay = function (player) {
      player.attr('style', "visibility:hidden");
    };

    var showPlayer = function (player) {
      player.attr('style', "visibility:visible");
    };
    var getVideoUrl = function (video) {
      return MediaServer + "/mediaServer/video/stream/" + video.urltoken + "?sessionToken=" + sessionToken;
    };

    var getVideoPlayer = function () {
      return $(event.target).closest('#palyerBorder').find('#example_video_html5_api');
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


    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.rateMax = 10;
    $scope.hoveringOver = function (value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.rateMax);
    };
    $scope.ratingClick = function(){
      alert('rating click');
    };

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  });
