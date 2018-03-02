(function () {

    'use strict';

    angular
        .module('zoneapp')
        .controller('editProjectController', editProjectController);

    editProjectController.$inject = ['$scope', 'authService', '$location', '$http', '$routeParams', '$mdToast'];

    function editProjectController($scope, authService, $location, $http, $routeParams, $mdToast) {
        var vm = this;
        vm.authService = authService;
        console.log($routeParams);
        $scope.projectId = $routeParams.projectId;
        $scope.go = function (path) {

            $location.path(path);
        };
        $scope.repoTypes = [{
            "name": "Public",
            "value": "public"
        }, {
            "name": "Private",
            "value": "private"
        }];
        $scope.repoType = "public";
        $scope.editProjectSubmit = false;
        $http({
            method: 'GET',
            url: 'https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects/' + $scope.projectId,
            headers: {
                'Authorization': localStorage.getItem("id_token"),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
        }).then(function (response) {

            $scope.data = response.data.body.Item;

        });

        $scope.updateProject = function (data) {
            $scope.editProjectSubmit = true;
            if (data) {
                var projectRequestData = {

                    "projectName": data.projectName,
                    "githubAccountName": data.githubAccountName,
                    "githubRepoName": data.githubRepoName,
                    "githubSubfolderName": data.githubSubfolderName,
                    "githubRepoBranch": data.githubRepoBranch,
                    "repoType": data.repoType,

                };
                $http({
                    method: 'PUT',
                    url: 'https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects/' + $scope.projectId,
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*"
                    },
                    data: projectRequestData
                }).then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Project is updated successfully')
                        .position('top right')
                        .hideDelay(3000)
                    );

                    $scope.go("/projects");

                });

            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Error Occured, Please enter Project details')

                    .hideDelay(3000)
                );
            }
        };

        $scope.userState = '';
        $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });
    }

}());