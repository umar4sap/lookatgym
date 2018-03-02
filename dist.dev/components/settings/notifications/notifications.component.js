(function() {
    'use strict';
    angular
        .module('zoneapp')
        .controller('NotificationsController', NotificationsController);
    NotificationsController.$inject = ['authService', '$location', '$mdDialog'];

    function NotificationsController(authService, $location, $mdDialog) {
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

        vm.addPhone = function(ev) {
            $mdDialog.show({
                    controller: NotificationsController,
                    templateUrl: '/components/settings/notifications/phonenumber.dialog.template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    vm.status = 'You said the information was "' + answer + '".';
                }, function() {
                    vm.status = 'You cancelled the dialog.';
                });
            vm.cancel = function() {
                $mdDialog.cancel();
            };
        };

        vm.addSlack = function(ev) {
            $mdDialog.show({
                    controller: NotificationsController,
                    templateUrl: '/components/settings/notifications/slack.dialog.template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    vm.status = 'You said the information was "' + answer + '".';
                }, function() {
                    vm.status = 'You cancelled the dialog.';
                });
            vm.cancel = function() {
                $mdDialog.cancel();
            };
        };

    }
}());