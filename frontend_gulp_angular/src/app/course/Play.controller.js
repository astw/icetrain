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
    var currentVideo;
    var currentModuel;

    $scope.user = auth.currentUser();
    $scope.showVideoPlayer = true;
    $scope.userLoggedIn = true;
    if (!sessionToken) {
      $scope.userLoggedIn = false;
    }
    ;

    $scope.videoUrl = MediaServer + $location.url() + "?sessionToken=" + sessionToken;
    $scope.course = relayService.getKeyValue('course');
    $scope.modules = [].concat($scope.course.complexModules);

    var watchHistory = getWatchHistory();
    $scope.select = function (module) {
      if (!module) return;
      module.show = true;
      $scope.currentModule = module;
    };

    $scope.showModule = function (module) {
      return !module.show;
    };

    $scope.moduleClick = function (module) {
      module.show = !!!module.show;
    };

    $scope.getVideoClass = function (video) {
      if (video === currentVideo || video.played == true)
        return " current watched";
      else {
        //watchHistory = getWatchHistory();
        if (watchHistory) {
          for (var i = 0; i < watchHistory.length; i++) {
            if (watchHistory[i].videoid === video.id) {
              return watchHistory[i].status;
            }
          }
        }
      }
    };

    $scope.videoClicked = function (module, video) {
      currentModuel = module;
      currentVideo = video;

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
      showPlayer(player);
      $scope.safeApply();
      relayService.putKeyValue('course', $scope.course);
    };

    $scope.playNextModule = function () {
      var idx = $scope.modules.indexOf($scope.currentModule);
      if (idx <= $scope.modules.length - 1) {
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
        setEndOfCourse();
      }
    };

    var setEndOfModule = function () {
      $scope.showEndOfCourse = false;
      $scope.showNextModule = true;
      $scope.showVideoPlayer = false;

      var player = getVideoPlayer();
      player.attr('src', '');
      player.load();
    };

    var setEndOfCourse = function () {
      // end of this class
      //player.attr('style',"visibility:hidden");
      $scope.showEndOfCourse = true;
      $scope.showNextModule = false;
      $scope.showVideoPlayer = false;

      var player = getVideoPlayer();
      player.attr('src', '');
      player.load();
    };
    var getNextVideo = function (module, currentVideo) {
      var idx = 0;
      for (idx = 0; i < module.videoCollection.length; idx++) {
        if (currentVideo.id === module.videoCollection[idx].id) {
          break;
        }
      }

      if (idx <= module.videoCollection.length - 1) {
        return module.videoCollection[idx + 1];
      }
      else {
        // end of this module
        // reminder user click to watch next module
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

    var showPlayer = function (player) {
      player.attr('style', "visibility:visible");
    };

    var getVideoUrl = function (video) {
      return MediaServer + "/mediaServer/video/stream/" + video.urltoken + "?sessionToken=" + sessionToken;
    };

    function getVideoPlayer() {
      //var player = $(this.document).find("#example_video");
      return $(event.target).closest('#palyerBorder').find('#example_video_html5_api');
    }

    var addWatchHistory = function (module, video) {
      watchHistoryService.addUserWatchHistory(
        $scope.user.id, $scope.course.id, module.id, video.id).
      then(function(res){
        watchHistory.push(res.data);
      });
    };
    var updateWatchHistoryWatched = function (module, video) {
      watchHistoryService.updateWatchHistoryWatched(
        $scope.user.id, $scope.course.id, module.id, video.id).
        then(function () {
          // update catch, and local watch history
          if (watchHistory) {
            for (var i = 0; i < watchHistory.length; i++) {
              var history = watchHistory[i];
              if (history.courseid === $scope.course.id &&
                history.moduleid === module.id &&
                history.videoid === video.id) {
                history.status = 'watched';
              }
            }
            //update catch
            updateWatchHistoryCache();
            $scope.safeApply();
          }
        })
    };

    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.rateMax = 10;
    $scope.hoveringOver = function (value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.rateMax);
    };
    $scope.ratingClick = function () {
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

    function updateWatchHistoryCache() {
      var historyKey = 'userid_' + $scope.user.id + "_courseid_" + $scope.course.id;
      relayService.putKeyValue(historyKey, watchHistory);
    }

    function getWatchHistory() {
      var historyKey = 'userid_' + $scope.user.id + "_courseid_" + $scope.course.id;
      var watchHistory = relayService.getKeyValue(historyKey);
      if (!watchHistory) {
        watchHistoryService.getUserCourseWatchHistory($scope.user.id, $scope.course.id).then(function (res) {
          if (res.status == 200) {
            watchHistory = res.data;
            $scope.$applyAsync();
            relayService.putKeyValue(historyKey, watchHistory);
          }
        });
      }
      return watchHistory;
    }

    var initVideoToken = $location.url().split('/mediaServer/video/stream/')[1];

    for (var i = 0; i < $scope.modules.length; i++) {
      for (var j = 0; j < $scope.modules[i].videoCollection.length; j++)
        if (initVideoToken === $scope.modules[i].videoCollection[j].urltoken) {
          currentModuel = $scope.modules[i];
          currentVideo = currentModuel.videoCollection[j];
          addWatchHistory(currentModuel, currentVideo)
        }
    }
    angular.element(document).ready(function () {
      //var player = getVideoPlayer();
      $("#example_video").bind('ended', function () {
        console.log('video is ended');
        // update whatch history
        updateWatchHistoryWatched(currentModuel, currentVideo);
        var nextVideo = getNextVideo(currentModuel, currentVideo, this);
        if (!nextVideo) {
          var currentVideoIndex = $scope.modules.indexOf(currentModuel);
          currentVideo.played = true; 

          if ( currentVideoIndex == $scope.modules.length - 1) {
            setEndOfCourse();
          }
          else
          //playNextModule();
            setEndOfModule();
        }
        else {
          currentVideo = nextVideo;
          //playNextModule();
          $scope.videoClicked(currentModuel, currentVideo);
        }
      });
    });
  });
