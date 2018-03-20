    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('ModalInstanceCtrlTrainer', function ($uibModalInstance,$scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
                var vm = this;
               
              
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
                vm.getAllPlans=function(){
                    
                    zoneService.getAllPlans(function(response){
                        debugger;
                        vm.plans=response.data.data
                    })
                }
              })
            .controller('trainersController', trainersController);

            trainersController.$inject = ['$scope', '$rootScope', 'zoneService','authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function trainersController($scope, $rootScope, zoneService,authService, $location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };

            vm.getAllTrainers=function(zoneId){
                
                zoneService.getAllTrainers(function(response){
                    debugger;
                    vm.trainers=response.data.data
                })
            }
            vm.getAllTrainers();


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

            $scope.trainermock= {
                "deparment": "cross fit",
                "description": "abids is having 10 years experiance",
                "photo": 
                    {
                        "id": "",
                        "title": "abids",
                        "url": "/images/user.png",
                        "urlType": "static"
                    }
                ,
                "name": "abids",
                "zoneName":""
       
            }
            $scope.fileAdded=function(file, msg, flow){
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file.file);
                fileReader.onload = function (event) {
                $scope.trainermock.photo.url=event.target.result;
                
                }
    
                
            }
            vm.getOwnersZones=function(){
                zoneService.getOwnersZones(function(response){
                    vm.zones=response.data.data
                })
            }
            vm.getOwnersZones();
            vm.createTrainer=function(data){
                var stringdata=data.zoneInfo;
                debugger;
                data.zoneInfo=JSON.parse(stringdata)
                $scope.trainermock.deparment=data.deparment;
                $scope.trainermock.description=data.description;
                $scope.trainermock.name=data.name;
                $scope.trainermock.zoneName=data.zoneInfo.zoneName;;
                debugger;
                zoneService.createTrainer(data.zoneId,$scope.trainermock,function(res){
                    console.log(res)
                    if(res.data.status==200){
                        $scope.showAlert(null,res.data.data.message);
                        vm.getAllTrainers();
                    }else{
                        $scope.showAlert(null,"error while creating trainer");
                        vm.getAllTrainers();
                    }
                    
                })
            }
            

  vm.open = function (size) {
    debugger;
 
  $uibModal.open({
    animation: vm.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    controller: 'ModalInstanceCtrlTrainer',
    templateUrl: 'components/zone-plans/zone-plan-dialog.html',
    controllerAs: 'vm',
    size: size

  
  });
}
            
        }
    }());