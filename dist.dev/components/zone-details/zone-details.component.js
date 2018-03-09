    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('zoneDetailsController', zoneDetailsController);

            zoneDetailsController.$inject = ['$scope', '$rootScope', 'authService','zoneService', '$location', '$http', '$q', '$mdDialog', 'moment', '$filter','$stateParams'];

        function zoneDetailsController($scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$stateParams) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);

                
            };

            var zoneId = $stateParams.zoneId;
            var city = $stateParams.city;
            zoneService.getZone(city,zoneId,function(res){
             
            vm.zoneData=res.data.data[0];
            console.log(vm.zoneData);
            })


            vm.getTrail = function(ev,zoneId,zoneName) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                  .title('Would you like to trail for day a at '+zoneName+ ' ?')
                  .textContent('Note You should not take this trail in last 3 month for '+zoneName+ ' club')
                  .placeholder('mobile number')
                  .ariaLabel('contact')
                  .initialValue('+91-')
                  .targetEvent(ev)
                 // .required(true)
                  .ok('Please Allow me for trail!')
                  .cancel('I Had 1 day trail');
            
                $mdDialog.show(confirm).then(function(result) {
                  $scope.status = 'You decided to name your dog ' + result + '.';
                }, function() {
                  $scope.status = 'You didn\'t name your dog.';
                });
              };

        }
    }());