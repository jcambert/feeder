(function(angular) {
  'use strict';

  angular
    .module('feeder')
    .directive('switch',switchBtn);

  /** @ngInject */
  function switchBtn($log) {
    return{
        restrict:'E',
        replace:true,
        template:'<label ><input type="checkbox" name="checkboxName" class="switchcheckbox" ng-model="ngModel" /> <div class="switch" ng-class="{\'switchOn\':ngModel}"></div><span>{{ngModel?labelon:labeloff}}</span></label>',
        scope:{
          ngModel:'=',
          labelon:'@',
          labeloff:'@',
          click:'&',
          enabled:'='
        },
        controller:function($scope){
          
          
        },
        link:function($scope,element,attrs){
            angular.element(element).find('.switch').click(function(){
                $scope.click();
            });
            /*$scope.$watch('ngModel',function(){
              $log.log('switch ngModel change to:');
              $log.log($scope.ngModel);
              $scope.label=$scope.ngModel?$scope.labelon:$scope.labeloff;
              if($scope.ngModel)
                angular.element(this).addClass('switchOn');
              else
                angular.element(this).removeClass('switchOn');
          }) ;*/
        }
    }
  }

})(angular);
