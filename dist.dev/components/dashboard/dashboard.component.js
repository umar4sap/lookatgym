//var jq = $.noConflict();
angular
    .module('zoneapp')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$state','$scope', 'authService','zoneService', '$location', '$http',];

function DashboardController($state,$scope, authService,zoneService, $location, $http) {
    var vm = this;
    vm.authService = authService;
    vm.inprogress=true;
    vm.go = function (path) {
        debugger;
        $state.go(path);
    };

   // $state.go('tileboard');
    var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);

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