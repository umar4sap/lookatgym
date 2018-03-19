    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('ModalInstanceCtrl', function ($uibModalInstance,planData,$scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
                var vm = this;
               debugger;
                vm.planData = planData;
                vm.getPlan=function(planId){
                    
                    zoneService.getPlanById(vm.planData,function(response){
                        debugger;
                        vm.plan=response.data.data[0];
                        console.log(vm.plan);
                    })
                }
                if(vm.planData.planMode){
                vm.getPlan();
                }
                vm.ok = function () {
                  $uibModalInstance.close(vm.selected.item);
                };
              
                vm.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
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
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAllPlans();
                            $scope.plancreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating plan");
                            vm.getAllPlans();
                            $scope.plancreation=false;
                        }
                        
                    })
                }
               

                vm.editPlan=function(data){
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
                   
                    zoneService.updatePlanById(vm.planData,$scope.planmock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAllPlans();
                            $scope.plancreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
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
            })
              
            .controller('zonePlansController', zonePlansController);

            zonePlansController.$inject = ['$scope', '$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter','$uibModal', '$log', '$document'];

        function zonePlansController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);
   
            };

          
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
            vm.list=true;
            vm.viewType=function(data){
                debugger;
                if(data=="list"){
                    vm.list=true;
                    vm.grid=false;
            }else{
                vm.grid=true;
                vm.list=false;
            }
        }



  vm.animationsEnabled = true;

  vm.open = function (size) {
      debugger;
   
    $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controller: 'ModalInstanceCtrl',
      templateUrl: 'components/zone-plans/zone-plan-dialog.html',
      controllerAs: 'vm',
      size: size,
      resolve: {
        planData: function () {
          return {planMode:"edit"};
        }
    }
    
    });
}

vm.edit = function (size,planId,zoneId) {
    debugger;
 
  $uibModal.open({
    animation: vm.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    controller: 'ModalInstanceCtrl',
    templateUrl: 'components/zone-plans/zone-plan-edit-dialog.html',
    controllerAs: 'vm',
    size: size,
    resolve: {
        planData: function () {
          return {planMode:"edit",planId:planId,zoneId:zoneId};
        }
    }
  
  });
}
        }
    }());