(function () {
	'use strict';
	angular.module('zoneapp').controller('viewPipelineController', viewPipelineController);

	viewPipelineController.$inject = ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$q', 'Pubnub', '$mdToast'];

	function viewPipelineController($scope, $rootScope, $location, $http, $routeParams, $q, Pubnub, $mdToast) {
		var vm = this;
		vm.dataLoaded = false;
		vm.go = go;
		vm.pipelineData = null;
		vm.states = [];
		vm.pipelineId = $routeParams.pipelineID;
		vm.buildsData = [];

		// vm.showStatus = showStatus;

		function go(path) {
			$location.path(path);
		}
		$scope.go = function (path) {
			$location.path(path);
		};

		var statusArray = [];
		// viewpipeline.compo.js
		$scope.executionTriggered = false;
		$scope.executePipeline = function (pipelineId) {
			debugger;
			$scope.executionTriggered = true;
			var pipelineId = pipelineId;
			var executionid = 'trigger' + Math.floor((Math.random() * 10796868558574747) + 1);
			$http({
				'method': 'POST',
				'url': "https://1wzbdzofo9.execute-api.us-west-2.amazonaws.com/dev/execute/" + pipelineId,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'Authorization': localStorage.getItem("id_token")
				},
				data: {
					executionId: pipelineId + '_' + executionid
				}
			}).then(function (response) {
				debugger;
				console.log("Pipeline Execution Engine message : pipeline Executed successfully:" + response);
				loadPipelines();
				$scope.executionTriggered = false;
			})

		}


		loadPipelines();

		function loadPipelines() {
			//get pipeline
			$http({
				'method': 'GET',
				'url': 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + $routeParams.pipelineID + '',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'Authorization': localStorage.getItem("id_token")
				}
			}).then(function (response) {
				vm.pipelineData = response.data.body.Item;
				var states = response.data.body.Item.pipelineInfo.states;
				var statesIds = Object.keys(states);
				var statesLength = statesIds.length;
				vm.states = states;
				var sid = response.data.body.Item.pipelineInfo.StartAt;
				// for (var s = 0; s < statesLength; s++) {
				// 	
				// 	if (sid === statesIds[s]) {
				// 		vm.states.push(states[statesIds[s]]);
				// 		if (states[statesIds[s]].Next !== undefined) {
				// 			sid = states[statesIds[s]].Next;
				// 			s = -1;
				// 		} else {
				// 			s = -1;
				// 		}
				// 		if (vm.states.length === statesLength) {
				// 			break;
				// 		}
				// 	}
				// }
				vm.dataLoaded = true;
				getProjectById(vm.pipelineData.projectID);
			});
		}

		function getProjectById(projectId) {
			$http({
				method: 'GET',
				url: 'https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects/' + projectId,
				headers: {
					'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
				}
			}).then(function (response) {
				loadPiplineExecutions(response.data.body.Item);
			});
		}

		function loadPiplineExecutions(project) {
			vm.loadingexecutions = true;
			if ($routeParams.pipelineID) {
				$http({
					url: "https://1wzbdzofo9.execute-api.us-west-2.amazonaws.com/dev/execute/execution/" + $routeParams.pipelineID,
					method: "GET",
					headers: {
						'Authorization': localStorage.getItem("id_token"),
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': "*"
					}
				}).then(function (response) {
					var buildsData = response.data.body.Items;
					if (buildsData.length > 0) {
						angular.forEach(buildsData, function (value, key) {
							var executiondata = {
								status: "",
								build: "5",
								commit: "",
								branch: project.githubRepoBranch,
								projectName: project.projectName,
								duration: "2 minutes",
								completed: "10 mins ago",
								redeploy: "",
								executionId: ""
							};
							if (value.pipelineId == $routeParams.pipelineID) {
								executiondata.commit = value.commitId;
								executiondata.executionId = value.executionId;
								vm.buildsData.push(executiondata);
								createchannelPack(executiondata.executionId);
							}



							// function showStatus() {
							// 	var status = "";
							// 	angular.forEach(statusArray, function (value, key) {
							// 		
							// 		status.value.status;
							// 	});
							// 	return status;
							// }
							//to check string
							Array.prototype.contains = function (element) {
								return this.indexOf(element) > -1;
							};
							var pipeData = [];

							function createchannelPack(executionId, cb) {
								var pipelineStates = Object.keys(vm.states);
								var pipestatus = "";
								pipelineStates.reduce(function (p, val) {

										// The initial promise object
										if (p.then === undefined) {
											p.resolve();
											p = p.promise;


										}

										return p.then(function () {
											var channelPack = executionId + '_status';

											getMessages(channelPack, function (data) {
												pipeData.push(data);
												//	console.log("Latest>>>" + pipeData);
												if (pipeData.contains("RUNNING IT") || pipeData.contains("STARTED")) {
													executiondata.status = "RUNNING";
													executiondata.color = 'font-weight: 900;color :' + "#00cbca";


												} else if (pipeData.contains("FAILED")) {
													executiondata.status = "FAILED";
													executiondata.color = 'font-weight: 900;color :' + "#e00a2a";

												} else if (pipeData.contains("SUCCESS")) {
													executiondata.status = "SUCCESS";
													executiondata.color = 'font-weight: 900;color :' + "#2595e9";
												}
												$scope.$apply();
											});


										});

									},
									$q.defer());

							}
						});
						vm.loadingexecutions = false;
						window.reload();
					} else if (buildsData.length === 0) {
						$mdToast.show(
							$mdToast.simple()
							.textContent('No Executions found.')
							.position('top center')
							.hideDelay(3000)
						);
						vm.loadingexecutions = false;
						window.reload();
					}
				});
			}

		}
		//get status from pubub
		function getMessages(channelPack, cb) {
			var currentStatus;
			Pubnub.setAuthKey(channelPack);
			Pubnub.history({
					channel: channelPack,
					reverse: false, // true to send via post
					count: 1 // how many items to fetch
				},
				function (status, response) {

					if (response.messages.length > 0) {
						currentStatus = response.messages[0].entry.status;
						statusArray.push(currentStatus);


					}
					return cb(currentStatus);
				}
			);
			listenerForStatus(channelPack);
		}

		function listenerForStatus(channelPack) {
			Pubnub.setAuthKey(channelPack);
			// Subscribe to a channel
			Pubnub.addListener({
				status: function (statusEvent) {
					if (statusEvent.category === "PNConnectedCategory") {
						//	console.log("Subscribied to channel >>>" + channelPack);
					} else if (statusEvent.category === "PNUnknownCategory") {
						var newState = {
							new: 'error'
						};
						Pubnub.setState({
								state: newState
							},
							function (status) {
								//	console.log(statusEvent.errorData.message);
							}
						);
					}
				},
				message: function (message) {
					$scope.$apply(function () {
						statusArray.push(message.message);
					});
					//	console.log(message.message);
				}
			});
			Pubnub.subscribe({
				channels: [channelPack]
			});
		}
	}
}());