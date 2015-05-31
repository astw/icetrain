/**
 * Created by Administrator on 30/05/2015.
 */

angular.module('icetraiFront')
  .service('relayService',function(){
    var bag ={};

    var put = function(obj){
      bag = obj;
    }

    var get = function(){
      return bag;
    }

    return{
      get:get,
      put:put
    }
});
