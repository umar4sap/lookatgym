    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('badgesController', badgesController);

            badgesController.$inject = ['$scope', '$rootScope', 'authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function badgesController($scope, $rootScope, authService, $location, $http, $q, $mdDialog, moment, $filter) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };
        }
    }());