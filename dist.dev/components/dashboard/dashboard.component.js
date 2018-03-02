//var jq = $.noConflict();
angular
    .module('zoneapp')
    .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$state','$scope', 'authService', '$location', '$http', 'Pubnub'];

function DashboardController($state,$scope, authService, $location, $http, Pubnub) {
    var vm = this;
    vm.authService = authService;
   
    vm.go = function (path) {
        debugger;
        $state.go(path);
    };
    var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);

    }