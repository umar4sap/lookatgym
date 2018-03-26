    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('memberDetailsController', memberDetailsController);

            memberDetailsController.$inject = ['$scope', '$rootScope', 'authService','zoneService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter','$stateParams'];

        function memberDetailsController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$stateParams) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
             $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };

            var zoneId = $stateParams.zoneId;
            var memberId = $stateParams.memberId;
            


        }
    }());