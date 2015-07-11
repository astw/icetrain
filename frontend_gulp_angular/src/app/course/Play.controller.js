/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, relayService,
                                    $http, $location, $sce, auth,
                                    courseRepository,
                                    watchHistoryService) {

    var MediaServer = "http://localhost:1337";
    var sessionToken = auth.sessionToken();

    $scope.user = auth.currentUser();
    $scope.showVideoPlayer = true;
    $scope.userLoggedIn = true;
    if (!sessionToken) {
      $scope.userLoggedIn = false;
    };

    $scope.videoUrl = MediaServer + $location.url() + "?sessionToken=" + sessionToken;
    $scope.course = relayService.getKeyValue('course');
    $scope.modules = [].concat($scope.course.complexModules);

    var historyKey = 'userid_' + $scope.user.id +"_courseid_" + $scope.course.id;
    var watchHistory =  relayService.getKeyValue(historyKey);
    if(!watchHistory){
      watchHistoryService.getUserCourseWatchHistory($scope.user.id, $scope.course.id).then(function(res){
        if(res.status == 200){
          watchHistory = res.data;
          $scope.$applyAsync();
          relayService.putKeyValue(historyKey,$scope.watchHistory);
        }
      });
    };


    //updateWatchHistoryWatched(initModule, initVideo);
    //
    ////--------- set player events
    //var player = getVideoPlayer();
    //player.bind('ended', function () {
    //  // update whatch history
    //  var nextVideo = getNextVideo(initModule, initVideo, player);
    //  if (!nextVideo) {
    //    setEndOfCourse();
    //  }
    //}
    ////

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
      else{
        if(watchHistory) {
          for (var i = 0; i < watchHistory.length; i++) {
            if (watchHistory[i].videoid === video.id) {
              return watchHistory[i].status;
            }
          }
        }
      }
    };

    $scope.videoClicked = function (module, video) {
      $scope.modules.forEach(function (m) {
        m.videoCollection.forEach(function (v) {
          v.current = false;
        })
      });

      $scope.showEndOfCourse = false;
      $scope.showNextModule = false;
      $scope.showVideoPlayer = true;
      $scope.currentModule = module;
      video.current = true;
      $scope.videoUrl = getVideoUrl(video);
      // add a new watchHistroy record
      addWatchHistory(module, video);

      var player = getVideoPlayer();
      player.attr('src', $scope.videoUrl);
      player.load();
      player.bind('ended', function () {
        // update whatch history
        updateWatchHistoryWatched(module, video);
        var nextVideo = getNextVideo(module, video, player);
        if (!nextVideo) {
          setEndOfCourse();
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
        //player.attr('style',"visibility:hidden");
        setEndOfCourse();
      }
    };

    var setEndOfCourse = function(){
      // end of this class
      //player.attr('style',"visibility:hidden");
      $scope.showEndOfCourse = true;
      $scope.showNextModule = false;
      $scope.showVideoPlayer = false;

      var player = getVideoPlayer();
      player.attr('src', '');
      player.load();
    };
    var getNextVideo = function (module, currentVideo, player) {
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
        $scope.showEndOfCourse = false;
        $scope.showNextModule = true;
        var player = getVideoPlayer();
        player.attr('src', '');
        player.load();
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

    var addWatchHistory = function(module,video){
      watchHistoryService.addUserWatchHistory(
        $scope.user.id, $scope.course.id, module.id,video.id);
    };
    var updateWatchHistoryWatched = function(module,video){
      watchHistoryService.updateWatchHistoryWatched(
        $scope.user.id, $scope.course.id, module.id,video.id);
    };

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


    //var initVideoToken = $location.url().split('/mediaServer/video/stream/')[1];
    //var initModule = null;
    //var initVideo = null;
    //for(var i=0; i< $scope.modules.length; i++){
    //  for(var j=0; j<$scope.modules[i].videoCollection.length; j++)
    //    if(initVideoToken === $scope.modules[i].videoCollection[j].urltoken){
    //      initModule = $scope.modules[i];
    //      initVideo = initModule.videoCollection[j];
    // //     $scope.videoClicked(initModule,initVideo);
    //    }
    //}
  });
