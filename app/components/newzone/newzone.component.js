    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('newZoneController', newZoneController);

        newZoneController.$inject = ['$scope', '$rootScope', 'authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function newZoneController($scope, $rootScope, authService, $location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };
        }
    }());