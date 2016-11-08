'use strict';

  angular
    .module('iceApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,
                    $http,
                    $rootScope,  
                    config,
                    authToken) {

    $http.defaults.headers.common[config.apiKeyName] = config.apiKeyValue;
    $http.defaults.headers.common[config.authTokenName] =  authToken.getToken();

    $log.debug('runBlock end');
  
  } 
