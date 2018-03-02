(function () {

    'use strict';

    angular
        .module('zoneapp')
        .controller('PipelinesController', PipelinesController);

    PipelinesController.$inject = ['$scope', 'authService', '$location', '$http', '$q'];

    function PipelinesController($scope, authService, $location, $http, $q) {
        var vm = this;
        vm.authService = authService;

        $scope.go = function (path) {
            $location.path(path);
        };
        vm.spinner = true;
        //Delete Pipeline
        $scope.delPipe = deletePipeline;

        function deletePipeline(delPipe) {
            //get pipeline to get delete cats and states first
            // $http({
            //         'method': 'GET',
            //         'url': 'https://veegam.azure-api.net/veegam/pipelines/' + delPipe + '',
            //         headers: {
            //             "Ocp-Apim-Subscription-Key": "2db7c591acc84ebfa0e7756ee1ded67b",
            //             'Authorization': localStorage.getItem("id_token"),
            //             'Content-Type': 'application/json',
            //         }
            //     }).then(function(response) {
            //         var stateIds = Object.keys(response.data.body.Item.pipelineInfo.states);

            //         var gettingCatIds = stateIds.map(function(stateID) {
            //             return $http({
            //                     method: 'GET',
            //                     url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + delPipe + '/stages/' + stateID + '',
            //                     headers: {
            //                         'Content-Type': 'application/json',
            //                         'Authorization': localStorage.getItem("id_token")
            //                     }
            //                 })
            //                 .then(function(result) { return result.data.body.Item; })
            //                 // fallback value to use when a request fails
            //                 .catch(function() { return 'no Category'; });
            //         });

            //         return $q.all(gettingCatIds);
            //     })
            //     .then(function(response) {
            //         var deletingCats;
            //         response.forEach(function(element) {
            //             deletingCats = element.stageCateogoriesID.map(function(catID) {

            //                 return $http({
            //                         method: 'DELETE',
            //                         url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + delPipe + '/stages/' + element.stageID + '/category/' + catID,
            //                         headers: {
            //                             'Content-Type': 'application/json',
            //                             'Authorization': localStorage.getItem("id_token")
            //                         }
            //                     })
            //                     .then(function(result) { return result.data.body.Item; })
            //                     // fallback value to use when a request fails
            //                     .catch(function() { return 'no Category'; });
            //             });
            //         }, this);

            //         return $q.all(deletingCats);
            //     })
            //     .then(function(response) {

            //     });
            $http({
                    'method': 'DELETE',
                    'url': 'https://veegam.azure-api.net/veegam/pipelines/' + delPipe + '',
                    headers: {
                        "Ocp-Apim-Subscription-Key": "2db7c591acc84ebfa0e7756ee1ded67b",
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                    }
                })
                .then(function (response) {
                    if (response.data.statusCode === "200") {
                        for (var d = 0; d < $scope.ciPipelines.length; d++) {
                            if ($scope.ciPipelines[d].pipelineID === delPipe) {
                                $scope.ciPipelines.splice(d, 1);
                            }
                        }
                    }
                });
        }
        //Delete Pipeline Ends Here
        $http({
                url: "https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines",
                method: "GET",
                headers: {
                    'Authorization': localStorage.getItem("id_token"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                }
            })
            .then(function (response) {

                $scope.ciPipelines = response.data.body.Items;
                if ($scope.ciPipelines !== null) {
                    angular.forEach($scope.ciPipelines, function (element) {
                        if (element.pipelinePublished === "draft") {
                            $http({
                                method: 'DELETE',
                                url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + element.pipelineID + '',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': localStorage.getItem("id_token")
                                }
                            });
                        }
                    }, this);
                }

                vm.spinner = false;
            });
    }

}());