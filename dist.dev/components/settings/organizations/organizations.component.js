(function () {
    'use strict';
    angular
        .module('zoneapp')
        .controller('organizationsController', organizationsController);
    organizationsController.$inject = ['authService', '$location', '$scope', '$mdToast', '$http', 'userManage', '$mdDialog', 'userManage'];

    function organizationsController(authService, $location, $scope, $mdToast, $http, userManage, $mdDialog) {
        $scope.loadOrgData = function () {
            userManage.getTenants(function (app_data) {
                $scope.tenants = Object.keys(app_data);
                $scope.orgAdmin = app_data;
            });
        };
        $scope.loadOrgData();
        var vm = this;
        vm.settings = [{
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

        vm.authService = authService;
        var userProfile = JSON.parse(localStorage.getItem("userProfile"));

        var orgsObj = userProfile.app_metadata.permissions.orgs;
        $scope.orgsObj = orgsObj;
        var orgs = {};
        for (var index = 0; index < orgsObj.length; index++) {
            var key = Object.keys(orgsObj[index]);
            key = key[0];
            orgs[key] = orgsObj[index][key];
            $scope.orgs = orgs;
            $scope.teams = [];
            $scope.teams.push($scope.orgs[key]);

        }


        

        $scope.addOrg = function (orgData, ev) {
            $mdDialog.show({
                    controller: addOrganizationController,
                    templateUrl: '/components/settings/organizations/addOrganization-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.addTeam = function (_org, ev) {
            $mdDialog.show({
                    controller: addTeamController,
                    templateUrl: '/components/settings/organizations/addTeam-org-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        org: _org
                    },
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.addUser = function (_team, _org, ev) {
            $mdDialog.show({
                    controller: addUserController,
                    templateUrl: '/components/settings/organizations/addUser-team-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        team: _team,
                        org: _org
                    },
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.viewTeamsUsers = function (_team, _org, ev) {
            $mdDialog.show({
                    controller: addUserController,
                    templateUrl: '/components/settings/organizations/viewTeamsUsers-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        team: _team,
                        org: _org
                    },
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        function addOrganizationController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.createOrg = function (orgData) {
                $http({
                    method: 'POST',
                    url: 'https://veegam.azure-api.net/manageorg/orgs',
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Ocp-Apim-Subscription-Key': 'b61acabd9cab4bd3a735c422edd9c394'
                    },
                    data: orgData
                }).then(function (response) {
                    updateOrgs();
                    $mdDialog.cancel();
                });
            };
        }

        function addTeamController($scope, $mdDialog, org) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope.createTeam = function (teamData, ev) {
                var p = jq(ev);
                var pew = org;
                $http({
                    method: 'POST',
                    url: 'https://veegam.azure-api.net/manageorg/orgs/' + org + '/team',
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Ocp-Apim-Subscription-Key': 'b61acabd9cab4bd3a735c422edd9c394'
                    },
                    data: teamData
                }).then(function (response) {
                    
                    updateOrgs();
                    $mdDialog.cancel();
                });
            };
        }

        function addUserController($scope, $mdDialog, team, org) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope.userRoles = [{
                "role": "User",
                "value": "user"
            }, {
                "role": "Admin",
                "value": "admin"
            }];
            
            $scope.createUser = function (userData, ev) {
                var userProfile = JSON.parse(localStorage.getItem("userProfile"));
                // var userid = userProfile.user_id.replace('github|', '');                
                var userid = userProfile.user_id;
                $http({
                    method: 'POST',
                    url: 'https://veegam.azure-api.net/manageorg/orgs/' + org + '/teams/' + team + '/members/' + userid,
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Ocp-Apim-Subscription-Key': 'b61acabd9cab4bd3a735c422edd9c394'
                    },
                    data: userData.info
                }).then(function (response) {
                    
                    updateOrgs();
                    $mdDialog.cancel();
                });
            };
        }

        function viewTeamsUsers($scope, $mdDialog, team, org) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope.selectedOrg = org;
            $scope.viewTeams = function (userData, ev) {
                updateOrgs();
            };
        }

        function updateOrgs() {
            var idToken = localStorage.getItem("id_token");
            var userProfile = JSON.parse(localStorage.getItem("userProfile"));
            var userid = userProfile.user_id.replace('github|', '');
            var t = userManage.getUserProfile(idToken, userid, function (loginCount, userProfile) {
                localStorage.removeItem("userProfile");
                localStorage.setItem("userProfile", JSON.stringify(userProfile));

                userProfile = JSON.parse(localStorage.getItem("userProfile"));

                var orgsObj = userProfile.app_metadata.permissions.orgs;
                $scope.orgsObj = orgsObj;
                var orgs = {};
                for (var index = 0; index < orgsObj.length; index++) {
                    var key = Object.keys(orgsObj[index]);
                    key = key[0];
                    orgs[key] = orgsObj[index][key];
                    $scope.orgs = orgs;
                    $scope.teams = [];
                    $scope.teams.push($scope.orgs[key]);

                }
            });

        }

        $scope.deleteOrg = function (orgid) {
            $http({
                method: 'DELETE',
                url: 'https://veegam.azure-api.net/manageorg/orgs/' + orgid,
                headers: {
                    'Authorization': localStorage.getItem("id_token"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Ocp-Apim-Subscription-Key': 'b61acabd9cab4bd3a735c422edd9c394'
                }
            }).then(function (response) {
                updateOrgs();
                
            });
        };
    }
}());