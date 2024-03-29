    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('ModalInstanceCtrlTrainer', function ($uibModalInstance,trainerData,$scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
                var vm = this;
               debugger;
                vm.trainerData = trainerData;
                vm.gettrainer=function(){
                    
                    zoneService.getTrainerById(vm.trainerData,function(response){
                        debugger;
                        vm.trainer=response.data.data[0];
                        console.log(vm.trainer);
                    })
                }
                if(vm.trainerData.trainerMode=="edit"){
                vm.gettrainer();
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
                    "zoneName":"",
                    "monthlySalary":0,
                    "joiningDate":"none",
                    "payoutDate":"none"
           
                }
                $scope.fileAdded=function(file, msg, flow){
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file.file);
                    fileReader.onload = function (event) {
                    $scope.trainermock.photo.url=event.target.result;
                    
                    }
        
                    
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
                vm.createTrainer=function(data){
                    var stringdata=data.zoneInfo;
                    debugger;
                    data.zoneInfo=JSON.parse(stringdata)
                    $scope.trainermock.name=data.name;
                    $scope.trainermock.zoneName=data.zoneInfo.zoneName;
                    $scope.trainermock.deparment=data.deparment;
                    $scope.trainermock.joiningDate=data.joiningDate;
                    $scope.trainermock.description=data.description;
                    $scope.trainermock.monthlySalary=data.monthlySalary || "none";
                    $scope.trainermock.payoutDate=data.payoutDate || "none";
                   
                    zoneService.createTrainer(data.zoneInfo.zoneId,$scope.trainermock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating trainer");
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }
                        
                    })
                }
               

                vm.edittrainer=function(data){
                    var stringdata=data.zoneInfo;
                    debugger;
                    data.zoneInfo=JSON.parse(stringdata)
                    $scope.trainermock.trainerName=data.trainerName;
                    $scope.trainermock.zoneName=data.zoneInfo.zoneName;
                    $scope.trainermock.trainerFee=data.trainerFee;
                    $scope.trainermock.abouttrainer=data.abouttrainer;
                    $scope.trainermock.trainerMonth=data.trainerMonth;
                    $scope.trainermock.trainerOffer=data.trainerOffer || "none";
                    $scope.trainermock.offerValidity=data.offerValidity || "none";
                   
                    zoneService.updateTrainerById(vm.trainerData,$scope.trainermock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating trainer");
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }
                        
                    })
                }



                vm.getAlltrainers=function(){
                    
                    zoneService.getAllTrainers(function(response){
                        debugger;
                        vm.trainers=response.data.data
                    })
                }
            })
              
            .controller('zonetrainersController', zonetrainersController);

            zonetrainersController.$inject = ['$scope', '$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter','$uibModal', '$log', '$document'];

        function zonetrainersController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);
   
            };

          
            vm.getAlltrainers=function(){
                
                zoneService.getAllTrainers(function(response){
                    debugger;
                    vm.trainers=response.data.data
                })
            }
            vm.getAlltrainers();

            $scope.newtrainer=function(){
                $scope.trainercreation=true;

            }

            vm.cancel=function(){
                $scope.trainercreation=false;
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
      controller: 'ModalInstanceCtrlTrainer',
      templateUrl: 'components/zone-trainers/zone-trainer-dialog.html',
      controllerAs: 'vm',
      size: size,
      resolve: {
        trainerData: function () {
          return {trainerMode:"open"};
        }
    }
    
    });
}

vm.edit = function (size,trainerId,zoneId) {
    debugger;
 
  $uibModal.open({
    animation: vm.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    controller: 'ModalInstanceCtrlTrainer',
    templateUrl: 'components/zone-trainers/zone-trainer-edit-dialog.html',
    controllerAs: 'vm',
    size: size,
    resolve: {
        trainerData: function () {
          return {trainerMode:"edit",trainerId:trainerId,zoneId:zoneId};
        }
    }
  
  });
}
        }
    }());