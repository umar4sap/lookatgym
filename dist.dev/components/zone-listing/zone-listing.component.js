    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('zoneListingController', zoneListingController);

            zoneListingController.$inject = ['$scope','$state', '$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function zoneListingController($scope,$state, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
              $scope.userProfile = JSON.parse(userProfile);
              vm.authService = authService;
              vm.inprogress=true;
              vm.go = function (path,zoneId,city) {
                debugger;
                $state.go(path,{ 'zoneId': zoneId, 'city': city });
            };
            vm.city=$scope.city || "HYDERBAD";
            
            vm.getZones=function(city){
                vm.inprogress=true;
                setTimeout(function(){
                zoneService.getZones(city,function(response){
                    debugger
                    vm.zones=response.data.data
                    vm.inprogress=false;
                })
                },3000)
            }
            vm.getZones(vm.city);
              
           
        }
    }());