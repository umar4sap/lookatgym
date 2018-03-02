(function () {
	'use strict';
	angular.module('zoneapp').controller('pipelinesDashboardController', pipelinesDashboardController);

	pipelinesDashboardController.$inject = ['$scope', '$location', '$http'];

	function pipelinesDashboardController($scope, $location, $http) {

		var vm = this;
		vm.executions = executions;
		vm.go = go;
		vm.ciPipelineExecution = [];

		function executions(path) {
			$location.path(path);
		}

		function go(path) {
			if (path === '/newPipeline') { localStorage.removeItem('pipelineID'); }
			$location.path(path);
		}

		loadpipline();

		function loadpipline() {
			$http({
				url: 'https://1wzbdzofo9.execute-api.us-west-2.amazonaws.com/dev/executions',
				method: "GET",
				headers: {
					'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
				}
			}).then(function (response) {
				var executedPiplines = response.data.body.Items;
				for (var i = 0; i < executedPiplines.length; i++) {	
					vm.ciPipelineExecution.push(executedPiplines[i].pipelineId);
					if (i == executedPiplines.length - 1) {
						Array.prototype.unique = function () {
							var r = [];
							o: for (var i = 0, n = this.length; i < n; i++) {
								for (var x = 0, y = r.length; x < y; x++) {
									if (r[x] == this[i]) continue o;
								}
								r[r.length] = this[i];
							}
							return r;
						};
						vm.ciPipelineExecution = vm.ciPipelineExecution.unique();
					}
				}
			});
		}
	
	$http({
		url: "https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines",
		method: "get",
		headers: {
			'Authorization': localStorage.getItem("id_token"),
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': "*"
		}
	})
	.then(function (response) {

		$scope.ciPipelines = response.data.body.Items;

		console.log('allpipes', $scope.ciPipelines);
		vm.spinner = false;
	});
	}
}());
