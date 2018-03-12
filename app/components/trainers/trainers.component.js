    (function () {
        'use strict';

        angular
            .module('zoneapp')
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
                "name": "abids"
       
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
                $scope.trainermock.deparment=data.deparment;
                $scope.trainermock.description=data.description;
                $scope.trainermock.name=data.name;
               
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
            
            
        }
    }());