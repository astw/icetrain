(function() {
  'use strict';

  angular
    .module('iceApp')
    .constant('config', {
      authTokenName:'Authorization',
      apiKeyName: 'clientkey',
      apiKeyValue:'anykey',
      apiRootPath: 'http://localhost:1337/',

      timeout: 1440 * 60 * 1000 //1440 minutes = 24 hrs
    });

})();
