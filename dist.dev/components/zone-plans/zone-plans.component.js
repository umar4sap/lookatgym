    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('zonePlansController', zonePlansController);

            zonePlansController.$inject = ['$scope', '$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function zonePlansController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);
   
            };

            vm.getOwnersZones=function(){
                zoneService.getOwnersZones(function(response){
                    vm.zones=response.data.data
                })
            }
            vm.getOwnersZones();
            $scope.planmock= {
                "planName": "cross fit",
                "zoneName": "",
                "planFee":"300",
                "planMonth": "abids",
                "planOffer":"none",
                "offerValidity":"none",
                "aboutPlan":""
       
            }
            $scope.showAlert = function(ev,msg) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Trainer Action')
                    .textContent(msg)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('okay!')
                    .targetEvent(ev)
                );
              };
            vm.createPlan=function(data){
                var stringdata=data.zoneInfo;
                debugger;
                data.zoneInfo=JSON.parse(stringdata)
                $scope.planmock.planName=data.planName;
                $scope.planmock.zoneName=data.zoneInfo.zoneName;
                $scope.planmock.planFee=data.planFee;
                $scope.planmock.aboutPlan=data.aboutPlan;
                $scope.planmock.planMonth=data.planMonth;
                $scope.planmock.planOffer=data.planOffer || "none";
                $scope.planmock.offerValidity=data.offerValidity || "none";
               
                zoneService.createPlan(data.zoneInfo.zoneId,$scope.planmock,function(res){
                    console.log(res)
                    if(res.data.status==200){
                        $scope.showAlert(null,res.data.data.message);
                        vm.getAllPlans();
                        $scope.plancreation=false;
                    }else{
                        $scope.showAlert(null,"error while creating plan");
                        vm.getAllPlans();
                        $scope.plancreation=false;
                    }
                    
                })
            }
            vm.getAllPlans=function(){
                
                zoneService.getAllPlans(function(response){
                    debugger;
                    vm.plans=response.data.data
                })
            }
            vm.getAllPlans();

            $scope.newplan=function(){
                $scope.plancreation=true;

            }

            vm.cancel=function(){
                $scope.plancreation=false;
            }
        }
    }());