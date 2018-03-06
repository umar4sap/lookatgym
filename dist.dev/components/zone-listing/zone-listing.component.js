    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('zoneListingController', zoneListingController);

            zoneListingController.$inject = ['$scope', '$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function zoneListingController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            
               
                vm.city=$scope.city || "Hyderabad";
                zoneService.getZones(vm.city,function(response){
                    debugger;
                    vm.zones=response.data.data
                })
           
        }
    }());