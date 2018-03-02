(function () {

	'use strict';
	angular.module('zoneapp').controller('pipelineExecutionsController', pipelineExecutionsController);

	pipelineExecutionsController.$inject = ['$scope', '$location', '$http', '$routeParams'];

	function pipelineExecutionsController($scope, $location, $http, $routeParams) {
		var vm = this;
		vm.buildsData = [];
		vm.executions = executions;

		function executions(path) {
			$location.path(path);
		}

		loadPipline();
		function loadPipline() {
			if ($routeParams.pipelineID) {
				$http({
					url: "https://1wzbdzofo9.execute-api.us-west-2.amazonaws.com/dev/executions",
					method: "GET",
					headers: {
						'Authorization': localStorage.getItem("id_token"),
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': "*"
					}
				}).then(function (response) {
					var buildsData = response.data.body.Items;
					if (buildsData) {
						for (var i = 0; i < buildsData.length; i++) {
							if (buildsData[i].pipelineId == $routeParams.pipelineID) {
								vm.buildsData.push(buildsData[i]);
							}
						}
					}
				});
			}
		}
	}
}());
