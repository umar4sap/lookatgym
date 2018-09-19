    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('addlistingController', addlistingController);

            addlistingController.$inject = ['$scope', '$state', 'authService', '$mdDialog','$location', '$http', '$q', '$mdToast', 'moment', '$filter','zoneService'];

        function addlistingController($scope, $state, authService, $mdDialog,$location, $http, $q, $mdToast, moment, $filter,zoneService) {
            var vm=this;
            vm.getOwnersZones=function(){
                vm.inprogress=true;
                
                zoneService.getOwnersZones(function(response){
                    debugger
                    vm.zones=response.data.data
                    vm.inprogress=false;
                })
                
            }
            vm.getOwnersZones();

        }
    }());