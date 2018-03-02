    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('trainersController', trainersController);

            trainersController.$inject = ['$scope', '$rootScope', 'authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function trainersController($scope, $rootScope, authService, $location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };
        }
    }());