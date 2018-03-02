(function() {
    'use strict';
    angular
        .module('zoneapp')
        .controller('SettingsController', SettingsController);
    SettingsController.$inject = ['authService', '$location', '$scope', '$mdDialog', 'userManage'];

    function SettingsController(authService, $location, $scope, $mdDialog, userManage) {
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
        var id_token = localStorage.getItem("id_token");
        var userData = JSON.parse(localStorage.getItem('userProfile'));
        $scope.githubUserId = userData.identities[0].user_id;
        userManage.getUserProfile(id_token,$scope.githubUserId, function() {

            $scope.userProfileData = JSON.parse(localStorage.getItem("userProfile"));
            console.log($scope.userProfileData);
        });

        function DialogController($scope, $mdDialog, userManage) {
            $scope.userProfileData = userManage.getTenants(function(app_data) {
                $scope.tenants = Object.keys(app_data);

            });





            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }



        $scope.switchAccounts = function(ev) {

            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/components/settings/accounts.component.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };


    }
}());