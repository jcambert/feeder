(function() {
  'use strict';

  angular
    .module('feeder')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope,$state,appdata) {

    $log.debug('runBlock end');
    
     $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams
                                                   , fromState, fromParams) {
       
        appdata.load();
        if(toState.name!='parameters' && _.size(appdata.datas)==0){
             e.preventDefault(); 
             $state.go('parameters');
        }

        
    });
  }

})();
