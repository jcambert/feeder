(function(angular) {
  'use strict';

  angular
    .module('feeder')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('parameters',{
          url:'/parameters',
          templateUrl:'app/main/parameters.html',
          controller:function($state,$scope,appdata){
              $scope.datas=appdata.datas;
              $scope.save=function(){
                  appdata.datas=$scope.datas;
                  appdata.save();
                  $state.go('home');
              };
              $scope.clear = function(){
                  appdata.clear();
                  $scope.datas={mqttserver:'',mqttport:0};
                 
              }
          }
      })
      .state('autofeed',{
          url:'/autofeed',
          template:'<div> Autofeed the cat</div>',
          controller:function($scope,mqttSocket){
              
          }
      })
      
      ;

    $urlRouterProvider.otherwise('/');
  }

})(angular);
