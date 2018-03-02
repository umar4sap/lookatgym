(function() {

    'use strict';

    angular
        .module('zoneapp')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$scope', 'authService', '$location', '$http', '$mdToast'];

    function ProjectsController($scope, authService, $location, $http, $mdToast) {
        var vm = this;
        vm.authService = authService;
        $scope.projectsLoaded = false;

        $scope.loadProjects = function() {
            $http({
                url: "https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects",
                method: "get",
                headers: {
                    'Authorization': localStorage.getItem("id_token"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                }
            })

            .then(function(response) {

                $scope.ciproject = response.data.body.Items;
                console.log('allproject', $scope.ciproject);
                $scope.projectsLoaded = true;
            });
        };
        $scope.loadProjects();
        $scope.deleteProject = function(projectID) {
            $http({
                    url: "https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects/" + projectID,
                    method: "DELETE",
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*"
                    }
                })
                .then(function(response) {

                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Project is successfully deleted')
                        .position('top center')
                        .hideDelay(3000)
                    );

                    $scope.loadProjects();
                    $scope.apply();

                });
        };

        $scope.go = function(path) {
            $location.path(path);
        };

    }

}());