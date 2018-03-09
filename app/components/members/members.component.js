    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('membersController', membersController);

            membersController.$inject = ['$scope', '$rootScope','$state','authService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter'];

        function membersController($scope, $rootScope,$state,authService, $location, $http, $q, $mdDialog, moment, $filter) {
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
        }
    }());