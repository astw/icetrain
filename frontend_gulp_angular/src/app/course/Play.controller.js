/**
 * Created by Administrator on 07/06/2015.
 */
'use strict';

angular.module('icetraiFront')
  .controller('PlayCtrl', function ($scope, $http,$location, $sce, auth, courseRepository) {

    $scope.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1',sections:[{name:"section name1"},{name:"section name2"}]},
      { title:'Dynamic Title 2', content:'Dynamic content 2',sections:[{name:"chapt2 section name1"},{name:"chapt2 section name2"}], disabled: true }
    ];

    $scope.select = function(tab){

    };
    $scope.showTab = function(tab){
       return  !!tab.show  ;//& tab.mouseOver;
    };

    $scope.tabClick = function(tab){
      if(!tab.show){
        tab.show = true;
      }
      else
        tab.show = false;
    };

    $scope.getVideoClass = function(section){
       if(section.current)
           return " current";
      else
          return " "
    };

    $scope.videoClicked = function(tab, section){
       for(var i=0; i< tab.sections.length; i++){
         tab.sections[i].current = false;
       }
       section.current = true;
    };

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
