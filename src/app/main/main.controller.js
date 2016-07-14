(function(angular) {
  'use strict';

  angular
    .module('feeder')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope,$scope,$timeout,$log, webDevTec, toastr,mqttSocket,appdata) {
    //var vm = this;
    var vm = $scope;
    appdata.load();
    var onmessage=false;var onconnection=false;
    vm.btnvalue=false;
    vm.autofeed=false;
    vm.connected=false;
    var onMessage =function(msg){
       onmessage=true;
       $log.log('receive from mqtt');
       $log.log(msg.destinationName);
       $log.log(Number(msg.payloadString));
       if(msg.destinationName=='feeder/isfeeding')
            vm.btnvalue=Number(msg.payloadString)==1;
       if(msg.destinationName=='feeder/isautofeeding')
            vm.autofeed=Number(msg.payloadString)==1;
       vm.$apply();
       $log.log(vm.btnvalue);
       onmessage=false;
    };
    
    $rootScope.$on('MQTT.CONNECTION_OPEN',function(){
        onconnection=true;
        $log.log('Connected to mqtt Server');
        mqttSocket.subscribe('feeder/isfeeding');
        mqttSocket.subscribe('feeder/isautofeeding');
        mqttSocket.publish('feeder/isfeed','');
        vm.connected=true;
        onconnection=false;
    });
   
   $rootScope.$on('MQTT.CONNECTION_CLOSE',function(){
       vm.connected=false;
    });
   
    mqttSocket.onConnectionLost(function(reason){
       vm.connected=false;
       $log.log('Conneciton Lost');
       $log.log(reason); 
    });
   
    vm.$watch('btnvalue',function(){
        if(onmessage && !onconnection)return;
        if(vm.btnvalue)
            mqttSocket.publish('feeder/feed','');
        else
            mqttSocket.publish('feeder/notfeed','');
    });
    
    vm.$watch('autofeed',function(){
        if(onmessage && !onconnection)return;
        if(vm.autofeed)
            mqttSocket.publish('feeder/autofeed','');
        
    });
    vm.mqttClick = function(){
        
        if(!vm.connected)
            mqttSocket.connectServer();
        else
            mqttSocket.disconnectServer();
    }
  /*  vm.$watch('connected',function(){
        if(onmessage && !onconnection)return;
        if(!vm.connected)
            mqttSocket.connectServer();
        else
            mqttSocket.disconnectServer();
        
    });*/
    
    mqttSocket.connect(appdata.datas.mqttserver || '192.168.0.21',appdata.datas.mqttport || 1883,'','feeder.io',onMessage);
     

  }
  
  angular
  .module('feeder')
  .service('appdata',function($localStorage){
      var self=this;
      self.datas={};
      self.save = function(){
          $localStorage.datas=self.datas;
      }
      self.load = function(){
          self.datas=$localStorage.datas ||{};
      }
      self.clear = function(){
          $localStorage.$reset();
      }
  })
})(angular);
