(function() {
    'use strict';

    angular
        .module('zoneapp').controller('splashpageController', splashpageController)

    .directive('splashpage', function() {
        return {
            templateUrl: 'directives/splashPage/splashPage.template.html'
        };
    });
    splashpageController.$inject = ['authService'];

    function splashpageController($scope, authService, $location) {
        var vm = this;
        vm.authService = authService;

        $scope.go = function(path) {
            $location.path(path);
        };
        var userProfile = localStorage.getItem('userProfile');
        $scope.userProfile = JSON.parse(userProfile);
        if (userProfile.logins_count === 0) {
            $scope.firstLogin = true;
        }

    }

})();