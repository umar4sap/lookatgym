    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('ModalInstanceCtrlexpances', function ($uibModalInstance,memberData,$scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
                var vm = this;
               debugger;
                vm.memberData = memberData;
                vm.getmember=function(memberId){
                    
                    zoneService.getmemberById(vm.memberData,function(response){
                        debugger;
                        vm.member=response.data.data[0];
                        console.log(vm.member);
                    })
                }
                if(vm.memberData.memberMode=="edit"){
                vm.getmember();
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
                $scope.membermock= {
                    "memberName": "cross fit",
                    "zoneName": "",
                    "memberFee":"300",
                    "memberMonth": "abids",
                    "memberOffer":"none",
                    "offerValidity":"none",
                    "aboutmember":""
           
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
                vm.createmember=function(data){
                    var stringdata=data.zoneInfo;
                    debugger;
                    data.zoneInfo=JSON.parse(stringdata)
                    $scope.membermock.memberName=data.memberName;
                    $scope.membermock.zoneName=data.zoneInfo.zoneName;
                    $scope.membermock.memberFee=data.memberFee;
                    $scope.membermock.aboutmember=data.aboutmember;
                    $scope.membermock.memberMonth=data.memberMonth;
                    $scope.membermock.memberOffer=data.memberOffer || "none";
                    $scope.membermock.offerValidity=data.offerValidity || "none";
                   
                    zoneService.createmember(data.zoneInfo.zoneId,$scope.membermock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAllmembers();
                            $scope.membercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating member");
                            vm.getAllmembers();
                            $scope.membercreation=false;
                        }
                        
                    })
                }
               

                vm.editmember=function(data){
                    var stringdata=data.zoneInfo;
                    debugger;
                    data.zoneInfo=JSON.parse(stringdata)
                    $scope.membermock.memberName=data.memberName;
                    $scope.membermock.zoneName=data.zoneInfo.zoneName;
                    $scope.membermock.memberFee=data.memberFee;
                    $scope.membermock.aboutmember=data.aboutmember;
                    $scope.membermock.memberMonth=data.memberMonth;
                    $scope.membermock.memberOffer=data.memberOffer || "none";
                    $scope.membermock.offerValidity=data.offerValidity || "none";
                   
                    zoneService.updatememberById(vm.memberData,$scope.membermock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAllmembers();
                            $scope.membercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating member");
                            vm.getAllmembers();
                            $scope.membercreation=false;
                        }
                        
                    })
                }



                vm.getAllmembers=function(){
                    
                    zoneService.getAllmembers(function(response){
                        debugger;
                        vm.members=response.data.data
                    })
                }
            })
            .controller('expancesController', membersController);

            membersController.$inject = ['$scope','$uibModal', '$rootScope','$state','authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function membersController($scope,$uibModal, $rootScope,$state,authService, $location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };

            vm.getMemberDetails=function (path,zoneId,memberId) {
                debugger;
                $state.go(path,{ 'zoneId': zoneId, 'memberId': memberId });
            };
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
        
        vm.open = function (size) {
            debugger;
         
          $uibModal.open({
            animation: vm.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'ModalInstanceCtrlmembers',
            templateUrl: 'components/Expances/expances.component.dialog.html',
            controllerAs: 'vm',
            size: size,
            resolve: {
              memberData: function () {
                return {memberMode:"open"};
              }
          }
          
          });
      }
      vm.view = function (size) {
        debugger;
     
      $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        controller: 'ModalInstanceCtrlexpances',
        templateUrl: 'components/Expances/expances.component.dialog-view.html',
        controllerAs: 'vm',
        size: size,
        resolve: {
          memberData: function () {
            return {memberMode:"view"};
          }
      }
      
      });
  }

    }
    }());

    