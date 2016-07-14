(function(angular,mqtt) {
  'use strict';
  angular
  .module('feeder')
  .factory('mqttSocket', function($rootScope,$log){
        var connected=false;
        var service = {};
        var client = {};
        var onConnectionLost =function(response){};
        var onMessageArrived = function(message){};
        var onConnect = function(){};
        service.connect = function(host, port,path,clientId,messageCallback) {
            
            $log.log("Try to connect to MQTT Broker " + host + " with user " + clientId);
            client = new mqtt.Client(host,parseInt(port),'/'+path,clientId+Date.now());

            client.onConnectionLost = function(response){
                connected=false;
                if (response.errorCode !== 0)
	                   $log.log("onConnectionLost:"+response.errorMessage);
                onConnectionLost(response);
                $log.log('Mqtt connection is lost');
                $rootScope.$broadcast("MQTT.CONNECTION_CLOSE");
            } ;
            client.onMessageArrived =function(message){
                //onMessageArrived(message);
                
                $log.log('Message arrived:');$log.log(message.destinationName);
                messageCallback(message);
            } 
            service.connectServer();
        }

        service.connectServer = function(){
             if(connected) return;
            client.connect({
                onSuccess:function(){
                 connected=true;   
                 onConnect();
                 $log.log("Mqtt connection is open");
                 $rootScope.$broadcast("MQTT.CONNECTION_OPEN")
                },
                mqttVersion:4
            });
        }

        service.disconnectServer = function(){
            client.disconnect();
        }
        
        service.publish = function(topic, payload) {
            if(!connected) return;
            var msg= new mqtt.Message(payload);
            msg.destinationName = topic;
            client.send(msg);
            //client.send(topic,payload, {retain: true});
            $log.log('publish-Event sent '+ payload + ' with topic: ' + topic + ' ' + client);
        }

       /* service.onMessage = function(callback) {
            onMessageArrived = callback;
        }*/

        service.onConnectionLost = function(callback){
            onConnectionLost=callback;
            
        }
        
        service.onConnect = function(callback){
            onConnect = callback;
           
        }
        
        service.subscribe = function(topic){
            client.subscribe(topic);
            $log.log('subscribe to topic:'+topic);
        }
        
        return service;
  })
})(angular,Paho.MQTT);

