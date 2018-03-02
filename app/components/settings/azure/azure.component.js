(function() {
    'use strict';
    angular
        .module('zoneapp')
        .controller('AzureController', AzureController);
    AzureController.$inject = ['authService', '$location'];

    function AzureController(authService, $location) {
        var vm = this;
        vm.settings = [
            { name: 'Profile', icon: 'keyboard_arrow_right', link: '/settings' },
            { name: 'Organization', icon: 'keyboard_arrow_right', link: '/organizations' },
            { name: 'Github', icon: 'keyboard_arrow_right', link: '/github' },
            { name: 'Azure', icon: 'keyboard_arrow_right', link: '/azure' },
            { name: 'Notifications', icon: 'keyboard_arrow_right', link: '/notifications' },
            { name: 'Customize', icon: 'keyboard_arrow_right', link: '/appearance' },
        ];
        vm.go = function(path) {
            $location.path(path);
        };
        vm.authService = authService;
    }
}());