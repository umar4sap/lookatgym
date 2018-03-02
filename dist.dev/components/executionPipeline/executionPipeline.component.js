(function () {
	var jq = $.noConflict();
	angular.module('zoneapp').controller('executionPipelineController', executionPipelineController)
		.filter('customArray', function ($filter) {
			return function (list, arrayFilter, element) {
				if (arrayFilter) {
					return $filter("filter")(list, function (listItem) {
						return arrayFilter.indexOf(listItem[element]) != -1;
					});
				}
			};
		});

	executionPipelineController.$inject = ['$scope', '$location', '$mdDialog', '$routeParams', '$http', '$q', '$sce', 'Pubnub', '$rootScope', '$timeout'];

	function executionPipelineController($scope, $location, $mdDialog, $routeParams, $http, $q, $sce, Pubnub, $rootScope, $timeout) {
		var vm = this;
		$scope.pane = {
			id: $routeParams.pipelineID,
			content: []
		};
		$scope.Bpane = {
			id: $routeParams.pipelineID,
			content: []
		};
		vm.spinner = true;
		vm.states = [];
		vm.commitId = '';
		vm.buildId = '';
		vm.githubAccountName = '';
		vm.tab = null;
		vm.pipelineDesc = '';
		vm.setTab = setTab;
		vm.stageName = '';
		vm.status = [];
		vm.bgColor = bgColor;
		$scope.categoryPanes = [];
		vm.stateTitle = "UNIT TESTS";
		vm.isSet = isSet;
		vm.logColor = logColor;
		vm.currentStatus = false;

		// $scope.$watch('pane', function (o, n) {

		// 	$scope.pane = n;
		// 	console.log('kjdsj fljvvd vchj gvfl udvg;i', $scope.pane);
		// });
		// $scope.$watch('categoryPanes', function (o, n) {

		// 	$scope.categoryPanes = n;
		// 	console.log('categoryPanes', $scope.pane);
		// });
		var headers = {
			'Authorization': localStorage.getItem("id_token"),
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': "*"
		};

		var executtionId = $routeParams.pipelineID;
		var fields = executtionId.split('_');



		vm.commitId = '#' + (fields[1].substring(1, 6));
		vm.buildId = '#' + (executtionId.substring(1, 6));

		var pipelineID = fields[0];
		var userData = JSON.parse(localStorage.getItem('userProfile'));
		vm.githubAccountName = userData.nickname;

		localStorage.removeItem('pipelineID');

		load();

		function load() {
			//get pipeline
			var getPipeline = $http({
				'method': 'GET',
				'url': 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '',
				headers: headers
			});

			getPipeline.then(function (result) {
				$scope.pipelineData = result.data.body.Item;
				$scope.pipelineInfo = result.data.body.Item.pipelineInfo;
				vm.pipelineDesc = result.data.body.Item.pipelineDescription;
				var orderingStages = [];
				var firstStateID = $scope.pipelineInfo.StartAt;
				var states = $scope.pipelineInfo.states;
				var statesLength = Object.keys(states).length;
				orderingStages.push(firstStateID);
				statesLength = statesLength - 1; // as already first stateId is in orderingStages array.
				for (i = 0; i < statesLength; i++) {
					if (states[firstStateID] && states[firstStateID].End) {
						orderingStages.push(firstStateID);
					} else {
						orderingStages.push(states[firstStateID].Next);
					}
					firstStateID = states[firstStateID].Next;
				}
				$scope.stateIds = orderingStages;
				localStorage.removeItem("orderedStates");
				localStorage.setItem("orderedStates", orderingStages);
				vm.tab = $scope.stateIds[0];
				var stateId = $scope.stateIds.map(function (stateID) {
					return $http({
						method: 'GET',
						url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + stateID + '',
						headers: headers
					}).then(function (result) {
						return result.data.body.Item;
					}).catch(function () {
						return 'no Category';
					});
				});
				return $q.all(stateId);
			}).then(function (response) {

				vm.states = response;
				getMessages(executtionId + "_status");
				status();
				vm.spinner = false;
				setTab(vm.states[0].stageType, vm.states[0]);
			});
		}

		function setTab(tabType, state) {

			switch (tabType) {
				case 'verify':
					$scope.pane.content = [];
					$scope.categoryPanes = [];
					vm.stateTitle = "UNIT TESTS";
					vm.stageName = state.stageName;
					$scope.pubnubbuildoutputsLogs = false;
					$scope.pubnubCategoryLogs = true;
					pubnublogs(state.stageID);
					pubnubCategorylogs(state.stageID);
					break;
				case 'build':
					$scope.pubnubCategoryLogs = false;
					$scope.Bpane.content = [];
					vm.stageName = state.stageName;
					vm.stateTitle = "BUILD LOGS";
					pubnubBuildlogs(state.stageID);
					$scope.pubnubbuildoutputsLogs = true;
					pubnubbuildoutputslogs(state.stageID);
					//pubnubCategorylogs(state.stageID);
					break;
				case 'environmentTest':
					//	console.log("environmentTest");
					break;
				case 'environmentProd':
					//	console.log("environmentProd");
					break;
			}
			vm.tab = state.stageID;
		}

		status();

		function status() {
			var pipelineStates = getPipelineById(pipelineID);
		}

		function getPipelineById(pipelineId) {
			return $http({
				url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineId + '',
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem("id_token")
				}
			}).then(function (response) {
				var states = response.data.body.Item.pipelineInfo.states;
				var pipelineStates = Object.keys(states);
				pipelineStates.reduce(function (p, val) {
					// The initial promise object
					if (p.then === undefined) {
						p.resolve();
						p = p.promise;
					}
					return p.then(function () {
						//return doSomething(val);
						var channelPack = executtionId + '_status';

					});
				}, $q.defer());
			});
		}

		function search(stateKey, states) {
			for (var i = 0; i < states.length; i++) {
				if (states[i].stageID === stateKey) {
					return states[i];
				}
			}
		}

		function isSet(tabId) {
			return vm.tab === tabId;
		}
		var wholeSatus = [];
		//pubnub live listeners regionStart
		function listenerForStatus(channelPack) {
			Pubnub.setAuthKey(channelPack);
			// Subscribe to a channel
			Pubnub.addListener({
				status: function (statusEvent) {
					if (statusEvent.category === "PNConnectedCategory") {} else if (statusEvent.category === "PNUnknownCategory") {
						var newState = {
							new: 'error'
						};
						Pubnub.setState({
								state: newState
							},
							function (status) {
								//console.log(statusEvent.errorData.message);
							}
						);
					}
				},
				message: function (message) {

					if (message.message.stageId) {

						if (wholeSatus.length == 0) {
							wholeSatus.push(message.message.status)
							console.log(wholeSatus);
							for (var i = 0; i < vm.states.length; i++) {
								var statusColor = "";
								var currentStatus;
								if (vm.states[i].stageID == message.message.stageId) {
									if (message.message.status === "RUNNING IT") {
										statusColor = 'background-color :' + "#ecec1d";

										currentStatus = 'running';
									}
									if (message.message.status === "FAILED") {
										statusColor = 'background-color :' + "#e00a2a";

										currentStatus = 'failed';
									}
									if (message.message.status === "SUCCESS") {
										statusColor = 'background-color :' + "#1fcc5a";
										currentStatus = 'success';

										if (vm.states[i + 1]) {
											setTab(vm.states[i + 1].stageType, vm.states[i + 1]);
											if (vm.states[i].stageType === 'build'){
												pubnubbuildoutputslogs(vm.states[i].stageID);
											}
										}

									}
									$scope.$apply(function () {

										vm.states[i].statusColor = statusColor;

										vm.states[i].status = currentStatus;
									});
								}


							}
						} else if (wholeSatus.lastIndexOf(message.message.status) == wholeSatus.length - 1) {
							console.log("ignored status" + message.message.status)
						} else {
							console.log("pushed status" + message.message.status)
							wholeSatus.push(message.message.status)
							console.log(wholeSatus);
							for (var i = 0; i < vm.states.length; i++) {
								var statusColor = "";

								var currentStatus = "";
								if (vm.states[i].stageID == message.message.stageId) {
									if (message.message.status === "RUNNING IT") {
										statusColor = 'background-color :' + "#ecec1d";
										currentStatus = "running"
									}
									if (message.message.status === "FAILED") {
										statusColor = 'background-color :' + "#e00a2a";

										currentStatus = "failed"
									}
									if (message.message.status === "SUCCESS") {
										statusColor = 'background-color :' + "#1fcc5a";
										currentStatus = "failed"

										if (vm.states[i + 1]) {
											setTab(vm.states[i + 1].stageType, vm.states[i + 1]);
										}
										if (vm.states[i].stageType === 'build') {
											pubnubbuildoutputslogs(vm.states[i].stageID);
										}
									}
									$scope.$apply(function () {

										vm.states[i].statusColor = statusColor;

										vm.states[i].status = currentStatus;

									});
								}
							}
							//vm.status.push(message.message);
							// $scope.$apply(function () {
							// 	vm.states= vm.states;

							// });
						}
					}
				}

			});

			Pubnub.subscribe({
				channels: [channelPack]
			});
		}

		function listenerForUTLogs(channelPackUnitlogs) {
			Pubnub.setAuthKey(channelPackUnitlogs);
			// Subscribe to a channel
			Pubnub.addListener({
				status: function (statusEvent) {
					if (statusEvent.category === "PNConnectedCategory") {} else if (statusEvent.category === "PNUnknownCategory") {
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
				message: function (response) {
					if (response.subscribedChannel === channelPackUnitlogs) {

						var _aa = $scope.pane.content;
						if (_aa.contains(response.message)) {
							//	console.log("contain duplicate");
						} else {

							//	angular.forEach(response, function (ele) {
							// var splitByLastColon = function (text) {
							// 	var index = text.lastIndexOf(':');
							// 	return [text.slice(0, index), text.slice(index + 1)];
							// };

							// var entry = splitByLastColon(response.message);
							// var pdate = entry[0].trim();
							// var now = new Date();
							// var date = now.toLocaleDateString();
							// var time = now.toLocaleTimeString();
							// entry[0] = "Date: " + date + " Time: " + time;
							// entry = {
							// 	"entryTime": entry[0],
							// 	'message': entry[1],
							// 	'logType': "success"
							// };
							$scope.pane.content.push(response.message);
							$scope.$apply();
						}

					}
					$scope.$apply(function () {
						$scope.pane = $scope.pane;
					});

				}
			});
			Pubnub.subscribe({
				channels: [channelPackUnitlogs]
			});
		}

		function listenerForBLogs(channelPackUnitlogs) {
			Pubnub.setAuthKey(channelPackUnitlogs);
			// Subscribe to a channel
			Pubnub.addListener({
				status: function (statusEvent) {
					if (statusEvent.category === "PNConnectedCategory") {} else if (statusEvent.category === "PNUnknownCategory") {
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
				message: function (response) {
					if (response.subscribedChannel === channelPackUnitlogs) {


						//	angular.forEach(response, function (ele) {
						// var splitByLastColon = function (text) {
						// 	var index = text.lastIndexOf(':');
						// 	return [text.slice(0, index), text.slice(index + 1)];
						// };

						// var entry = splitByLastColon(response.message);
						// var pdate = entry[0].trim();
						// var now = new Date();
						// var date = now.toLocaleDateString();
						// var time = now.toLocaleTimeString();
						// entry[0] = "LLDate: " + date + " Time: " + time;
						// entry = {
						// 	"entryTime": entry[0],
						// 	'message': entry[1],
						// 	'logType': "success"
						// };
						// var _aa = $scope.Bpane.content;
						// if (_aa.contains(entry)) {
						// 	//	console.log("contain duplicate");
						// }
						$scope.Bpane.content.push(response.message);
						//	});
						// $timeout(function () {
						// 	$scope.Bpane.content.push(entrydata);
						// });
					}
					$scope.$apply(function () {
						$scope.Bpane = $scope.Bpane;
					});

				}
			});
			Pubnub.subscribe({
				channels: [channelPackUnitlogs]
			});
		}
		// $scope.$watch($scope.Bpane.content, function (n,o) {
		// 	$scope.pane.content = n;
		// 	
		// });

		function listenerForTestCaseLogs(channelPackCatlogs) {

			var accordiansTestCaseLogs = [];
			Pubnub.setAuthKey(channelPackCatlogs);
			// Subscribe to a channel
			Pubnub.addListener({
				status: function (statusEvent) {
					if (statusEvent.category === "PNConnectedCategory") {} else if (statusEvent.category === "PNUnknownCategory") {
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
					if (message.subscribedChannel === channelPackCatlogs) {

						if ($scope.categoryPanes.length > 0) {
							angular.forEach($scope.categoryPanes, function (value, key) {
								if (value.featureId === message.message.featureId) {

									accordiansTestCaseLogs.push(value.featureId);
									value.featureId = message.message.featureId;
									var obj = {
										stepName: message.message.stepName,
										stepStatus: message.message.stepStatus
									};
									value.content.push(obj);
								} else if (accordiansTestCaseLogs.indexOf(message.message.featureId) == -1) {
									accordiansTestCaseLogs.push(message.message.featureId);
									var pane = {
										id: $routeParams.pipelineID,
										featureId: message.message.featureId,
										content: []
									};
									var obj1 = {
										stepName: message.message.stepName,
										stepStatus: message.message.stepStatus
									};
									pane.content.push(obj1);
									$scope.categoryPanes.push(pane);
								}
							});
						} else {
							var pane = {
								id: $routeParams.pipelineID,
								featureId: message.message.featureId,
								content: []
							};
							var obj1 = {
								stepName: message.message.stepName,
								stepStatus: message.message.stepStatus
							};
							pane.content.push(obj1);
							$scope.categoryPanes.push(pane);
							//$scope.categoryPanes.push(message.message);

						}
					}
					$scope.$apply(function () {
						$scope.categoryPanes = $scope.categoryPanes;
					});
				}
			});
			Pubnub.subscribe({
				channels: [channelPackCatlogs]
			});
		}
		//pubnub listeners regionEnd

		//pubnub history region
		Array.prototype.contains = function (element) {
			return this.indexOf(element) > -1;
		};

		function pubnublogs(stateId) {
			var channelPackUnitlogs = executtionId + '_' + stateId;
			Pubnub.setAuthKey(channelPackUnitlogs);
			listenerForUTLogs(channelPackUnitlogs);
			Pubnub.history({
					channel: channelPackUnitlogs,
					reverse: false, // true to send via post
					count: 30 // how many items to fetch
				},
				function (status, response) {
					if (status.statusCode === 403) {
						$scope.$apply(function () {});
					} else {
						if (response.messages.length === 0) {
							$scope.$apply(function () {
								$scope.pane = {
									id: $routeParams.pipelineID,
									content: []
								};
							});
						} else {
							angular.forEach(response.messages, function (v, k) {
								var _aa = $scope.pane.content;
								if (_aa.contains(v.entry)) {
									console.log("contain duplicate");
								} else {
									// var splitByLastColon = function (text) {
									// 	var index = text.lastIndexOf(':');
									// 	return [text.slice(0, index), text.slice(index + 1)];
									// };

									// var entry = splitByLastColon(v.entry);
									// var pdate = entry[0].trim();
									// var now = new Date();
									// var date = now.toLocaleDateString();
									// var time = now.toLocaleTimeString();
									// entry[0] = "Date: " + date + " Time: " + time;
									// entry = {
									// 	"entryTime": entry[0],
									// 	'message': entry[1],
									// 	'logType': "success"
									// };
									$scope.pane.content.push(v.entry);
									//$scope.pane.content.push(v.entry);

								}
							});
							$scope.$apply(function () {
								$scope.pane = $scope.pane;
							});
						}
					}
				}
			);

		}

		function pubnubBuildlogs(stateId) {
			var channelPackUnitlogs = executtionId + '_' + stateId;
			Pubnub.setAuthKey(channelPackUnitlogs);
			listenerForBLogs(channelPackUnitlogs);
			Pubnub.history({
					channel: channelPackUnitlogs,
					reverse: false, // true to send via post
					count: 30 // how many items to fetch
				},
				function (status, response) {
					if (status.statusCode === 403) {
						$scope.$apply(function () {});
					} else {
						if (response.messages.length === 0) {
							$scope.$apply(function () {
								$scope.Bpane = {
									id: $routeParams.pipelineID,
									content: []
								};
							});
						} else {
							angular.forEach(response.messages, function (v, k) {
								var _aa = $scope.Bpane.content;
								if (_aa.contains(v.entry)) {
									//	console.log("contain duplicate");
								} else {
									// var splitByLastColon = function (text) {
									// 	var index = text.lastIndexOf(':');
									// 	return [text.slice(0, index), text.slice(index + 1)];
									// };

									// var entry = splitByLastColon(v.entry);
									// var pdate = entry[0].trim();
									// var now = new Date();
									// var date = now.toLocaleDateString();
									// var time = now.toLocaleTimeString();
									// entry[0] = "Date: " + date + " Time: " + time;
									// entry = {
									// 	"entryTime": entry[0],
									// 	'message': entry[1],
									// 	'logType': "success"
									// };
									$scope.Bpane.content.push(v.entry);
									//$scope.Bpane.content.push(v.entry);

								}
							});
							$scope.$apply(function () {
								$scope.Bpane = $scope.Bpane;
							});
						}
					}
				}
			);

		}

		function pubnubCategorylogs(stateId) {
			$scope.categoryPanes = [];
			var resultObject = search(stateId, vm.states);
			angular.forEach(resultObject.stageCateogoriesID, function (value, key) {
				var channelPackCatlogs = executtionId + '_' + stateId + '_' + value;
				Pubnub.setAuthKey(channelPackCatlogs);
				listenerForTestCaseLogs(channelPackCatlogs);
				Pubnub.history({
						channel: channelPackCatlogs,
						reverse: false, // true to send via post
						count: 30 // how many items to fetch
					},
					function (status, response) {

						var accordians = [];
						if (status.statusCode === 403) {
							$scope.categoryPanes = [];
						} else {

							angular.forEach(response.messages, function (value, key) {

								if ($scope.categoryPanes.length > 0) {

									angular.forEach($scope.categoryPanes, function (value1, key1) {
										if (value.entry.featureId === value1.featureId) {
											accordians.push(value1.featureId);
											var obj = {
												stepName: value.entry.stepName,
												stepStatus: value.entry.stepStatus
											};
											value1.errorType = value.entry.errorType;
											value1.content.push(obj);
											$scope.$apply(function () {
												$scope.categoryPanes = $scope.categoryPanes;
											});
										} else {
											if (accordians.indexOf(value.entry.featureId) == -1) {
												//	console.log(accordians);
												accordians.push(value.entry.featureId);
												var paneObj = {
													id: $routeParams.pipelineID,
													header: value.entry.featurename,
													featureId: value.entry.featureId,
													content: [],
													errorType: value.entry.errorType
												};
												var obj1 = {
													stepName: value.entry.stepName,
													stepStatus: value.entry.stepStatus
												};
												paneObj.content.push(obj1);
												$scope.categoryPanes.push(paneObj);
												//console.log($scope.categoryPanes);
											}
											$scope.$apply(function () {
												$scope.categoryPanes = $scope.categoryPanes;
											});
										}

									});
								} else {

									var paneObj = {
										id: $routeParams.pipelineID,
										header: value.entry.featurename,
										featureId: value.entry.featureId,
										content: [],
										errorType: value.entry.errorType
									};
									var obj1 = {
										stepName: value.entry.stepName,
										stepStatus: value.entry.stepStatus
									};
									paneObj.content.push(obj1);
									$scope.categoryPanes.push(paneObj);
									//	console.log($scope.categoryPanes);
								}
							});
						}
						$scope.$apply(function () {
							$scope.categoryPanes = $scope.categoryPanes;
						});
					}

				);

			});
		}



		function pubnubbuildoutputslogs(stateId) {



			var channelPackCatlogs = executtionId + '_' + stateId + '_outputs';
			Pubnub.setAuthKey(channelPackCatlogs);
			//listenerForTestCaseLogs(channelPackCatlogs);
			Pubnub.history({
					channel: channelPackCatlogs,
					reverse: false, // true to send via post
					count: 30 // how many items to fetch
				},
				function (status, response) {


					if (status.statusCode === 403) {

					} else {
						if (response.messages[0]) {
							$scope.noBuildLogs = true;
							$scope.buildoutputs = response.messages[0].entry;
						} else {
							$scope.noBuildLogs = false;
						}

					}
				});

		}

		function getMessages(channelPack) {
			Pubnub.setAuthKey(channelPack);
			Pubnub.history({
					channel: channelPack,
					reverse: false, // true to send via post
					count: 150 // how many items to fetch
				},
				function (status, response) {
					if (status.statusCode === 403) {

					} else {
						if (response.messages.length === 0) {

						} else {
							angular.forEach(response.messages, function (value, key) {
								//	vm.status.push(value.entry);

								console.log("history called")

								var pubnubhistroyStatus = value.entry;
								for (var i = 0; i < vm.states.length; i++) {
									var statusColor = "";
									var currentStatus = "";
									if (vm.states[i].stageID == pubnubhistroyStatus.stageId) {
										if (pubnubhistroyStatus.status === "RUNNING IT") {
											statusColor = 'background-color :' + "#ecec1d";
											currentStatus = 'running';
										}
										if (pubnubhistroyStatus.status === "FAILED") {
											statusColor = 'background-color :' + "#e00a2a";
											currentStatus = 'failed';
										}
										if (pubnubhistroyStatus.status === "SUCCESS") {
											statusColor = 'background-color :' + "#1fcc5a";
											currentStatus = 'success';
										}
										$scope.$apply(function () {
											//	console.log(vm.states[i]);
											vm.states[i].statusColor = statusColor;
											vm.states[i].status = currentStatus;
										//	$scope.apply();
										});
									}


								}



							});
						}
					}
				}
			);
			listenerForStatus(channelPack);
		}


		//status color binding region
		function bgColor(stageId, stageType) {
			var bgcolor = 'background-color :' + "#808080";
			angular.forEach(vm.status, function (value, key) {
				if (value.status === "STARTED" && value.stageId === stageId) {
					bgcolor = 'background-color :' + "#ecec1d";
				} else if (value.status === "RUNNING" && value.stageId === stageId) {
					bgcolor = 'background-color :' + "#ecec1d";
				} else if (value.status === "FAILED" && value.stageId === stageId) {
					bgcolor = 'background-color :' + "#e00a2a";
				} else if (value.status === "SUCCESS" && value.stageId === stageId) {
					bgcolor = 'background-color :' + "#1fcc5a";
				}
			});
			return bgcolor;
		}

		function logColor(status) {
			var bgcolor = "";
			if (status === "warning") {
				bgcolor = 'border-left: 8px solid green;';
			}
			if (status === "failed") {
				bgcolor = 'border-left: 8px solid red;';

			}
			return bgcolor;
		}
		//status color binding regionEnd
	}
}());