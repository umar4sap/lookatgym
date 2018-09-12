(function() {

    'use strict';

    angular
        .module('zoneapp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['authService'];

    function HomeController(authService) {
        var userProfile = localStorage.getItem('profile');
        $scope.userProfile = JSON.parse(userProfile);
        var vm = this;
        vm.authService = authService;

    }

}());