(function () {
    'use strict';
    angular
        .module('zoneapp')
        .controller('manageorgController', manageorgController);
    manageorgController.$inject = ['authService', '$location', '$scope', '$mdToast', '$http', 'userManage', '$mdDialog', '$routeParams'];

    function manageorgController(authService, $location, $scope, $mdToast, $http, userManage, $mdDialog, $routeParams) {


        var vm = this;
        $scope.settings = [{
                name: 'Profile',
                icon: 'keyboard_arrow_right',
                link: '/settings'
            },
            {
                name: 'Organizations',
                icon: 'keyboard_arrow_right',
                link: '/organizations'
            },
            {
                name: 'Github',
                icon: 'keyboard_arrow_right',
                link: '/github'
            },
            {
                name: 'Azure',
                icon: 'keyboard_arrow_right',
                link: '/azure'
            },
            {
                name: 'Notifications',
                icon: 'keyboard_arrow_right',
                link: '/notifications'
            },
            {
                name: 'Customize',
                icon: 'keyboard_arrow_right',
                link: '/appearance'
            },
        ];
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.currentOrgName = $routeParams.orgname;
        $scope.loadUserListData = function () {
            userManage.getTenants(function (app_data) {
                //  $scope.tenants = Object.keys(app_data);
                for (var i = 0; i < app_data.length; i++) {

                    if ($scope.currentOrgName == app_data[i].orgname) {
                        $scope.userList = app_data[i].usersList;
                        $scope.apply();
                    }
                }


            });
        };
        $scope.loadUserListData();

        $scope.authService = authService;



        $scope.addUser = function (userName, plan) {
            if (userName && plan) {
                $http.get('https://api.github.com/users/' + userName).then(function (response) {
                    if (response.status == 200) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('User is available on Github')
                            .highlightAction(true)
                            .highlightClass('md-accent')
                            .position('top center')
                            .hideDelay(3000)
                        );

                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('User doesnt exist in github')
                            .highlightAction(true)
                            .highlightClass('md-accent')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }, function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('User doesnt exist in github')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('top right')
                        .hideDelay(3000)
                    );
                });
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('User details required')
                    .highlightAction(true)
                    .highlightClass('md-accent')
                    .position('top right')
                    .hideDelay(3000)
                );
            }
        };
    }
}());