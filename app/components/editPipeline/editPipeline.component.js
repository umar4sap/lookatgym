(function () {
    'use strict';

    angular
        .module('zoneapp')
        .controller('editPipelineController', editPipelineController);

    editPipelineController.$inject = ['$scope', '$rootScope', 'authService', '$location', '$http', '$routeParams', '$q', '$mdDialog', 'moment'];

    function editPipelineController($scope, $rootScope, authService, $location, $http, $routeParams, $q, $mdDialog, moment) {
        $rootScope.pipelineReady = false;
        var vm = this;
        vm.authService = authService;
        vm.go = function (path) {
            $location.path(path);
        };
        $scope.triggers = [{
                "name": "Pull Request",
                "value": "pullRequest"
            },
            {
                "name": "Schedule",
                "value": "schedule"
            }
        ];

        //hide image if new one upload 
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

        };

        $scope.locationKeyChain = true;
        // $scope.$on('$locationChangeStart', function (event) {
        //     if ($scope.locationKeyChain) {
        //         var answer = confirm("Are you sure you want to leave this page?");
        //         if (answer) {
        //             var pipelineID = localStorage.getItem("pipelineID");
        //             $http({
        //                     method: 'DELETE',
        //                     url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines' + pipelineID,
        //                     headers: {
        //                         'Authorization': localStorage.getItem("id_token"),
        //                         'Content-Type': 'application/json',
        //                         'Access-Control-Allow-Origin': "*"
        //                     }
        //                 })
        //                 .then(function (response) {});
        //         } else {
        //             event.preventDefault();
        //         }
        //     }
        // });

        $rootScope.statesLoaded = false;
        $scope.getStateClass = function (stateType) {

            //stateIcon
            switch (stateType) {
                case 'verify':
                    return "fa fa-cogs";
                case 'build':
                    return "fa fa-cloud-upload";
                case 'environmentTest':
                    return "fa fa-flask";
                case 'environmentProd':
                    return "fa fa-industry";
            }

        };
        $scope.pipelineID = $routeParams.pipelineID;
        localStorage.setItem("pipelineID", $scope.pipelineID);
        //getprojectsList
        $http({
                url: "https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects",
                method: "get",
                headers: {
                    'Authorization': localStorage.getItem("id_token"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                }
            })
            .then(function (response) {
                $scope.projectsList = response.data.body.Items;
            });
        //getprojectsList Ends

        //get pipeline
        $http({
                'method': 'GET',
                'url': 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + $scope.pipelineID + '',
                headers: {
                    'Content-Type': 'application/json',
                    //   'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                    'Authorization': localStorage.getItem("id_token")
                }
            })
            .then(function (response) {
                // var orderingStages = [];
                $scope.editPipeDate = response.data.body.Item;
                $scope.triggeredByOptionValue = $scope.editPipeDate;
                $scope.scopeStates = response.data.body.Item.pipelineInfo.states;
                $scope.startAt = response.data.body.Item.pipelineInfo.StartAt;
                localStorage.setItem("editPipelineStateStartAt", $scope.startAt);
                var scopeStateIds = Object.keys($scope.scopeStates);
                $scope.triggereBy = $scope.editPipeDate.pipelineSettings.triggeredBy.option;
                if ($scope.triggereBy === 'schedule') {
                    $rootScope.selectedSchedule = $scope.editPipeDate.pipelineSettings.triggeredBy.value;
                    $rootScope.selectedSchedule.startDate = moment($rootScope.selectedSchedule.startDate).format('YYYY-MM-DD');
                    $rootScope.selectedSchedule.endDate = moment($rootScope.selectedSchedule.endDate).format('YYYY-MM-DD');
                }
                var stateId = scopeStateIds.map(function (stateID) {
                    return $http({
                            method: 'GET',
                            url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + $scope.pipelineID + '/stages/' + stateID + '',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem("id_token")
                            }
                        })
                        .then(function (result) {
                            return result.data.body.Item;
                        })
                        // fallback value to use when a request fails
                        .catch(function () {
                            return 'No States';
                        });
                });

                return $q.all(stateId);
            })
            .then(function (response) {
                $scope.editStates = response;

                angular.forEach(response, function (element) {
                    if (element !== 'No States') {
                        if ("Next" in $scope.editPipeDate.pipelineInfo.states[element.stageID]) {
                            element.Next = $scope.editPipeDate.pipelineInfo.states[element.stageID].Next;
                        } else if ("End" in $scope.editPipeDate.pipelineInfo.states[element.stageID]) {
                            element.End = "true";
                        }
                    }
                }, this);
                localStorage.setItem("pipelineStates", JSON.stringify(response));
                $scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                var allStateIds = [];
                var allNextIds = [];
                for (var l = 0; l < $scope.pipelineStates.length; l++) {
                    var data = $scope.pipelineStates[l];
                    allStateIds.push(data.stageID);
                    allNextIds.push(data.Next);
                }
                Array.prototype.diff = function (a) {
                    return this.filter(function (f) {
                        return a.indexOf(f) < 0;
                    });
                };

                var startAtId = allStateIds.diff(allNextIds);
                // $scope.startAt = startAtId[0];\
                localStorage.setItem("temp", JSON.stringify($scope.pipelineStates));
                var existedStates = [];


                for (var u = 0; u < $scope.pipelineStates.length; u++) {
                    if ($scope.pipelineStates[u].stageID === $scope.startAt) {
                        existedStates.splice(u, 0, $scope.pipelineStates[u]);
                    }
                }
                var h = 0;
                var k;
                for (k = 0; k < $scope.pipelineStates.length; k++) {
                    if (existedStates[h].Next === $scope.pipelineStates[k].stageID) {
                        existedStates.splice(existedStates.length, 0, $scope.pipelineStates[k]);
                        h++;
                        k = -1;
                    }
                    if (existedStates.length === $scope.pipelineStates.length) {
                        break;
                    }
                }
                localStorage.setItem("rand", JSON.stringify(existedStates));

                localStorage.removeItem("pipelineStates");
                localStorage.setItem("pipelineStates", JSON.stringify(existedStates));
                $scope.editStates = JSON.parse(localStorage.getItem("pipelineStates"));

                $rootScope.statesLoaded = true;
                $rootScope.pipelineReady = true;
            });

        $scope.triggerChange = function (ev) {

            if ($scope.editPipeDate.pipelineSettings.triggeredBy.option === "schedule") {

                $mdDialog.show({
                        controller: DialogController,
                        templateUrl: '/components/editPipeline/scheduleEdit-dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    .then(function (answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });
            }
        };


        function DialogController($scope, $mdDialog, $filter) {
            if ($rootScope.selectedSchedule !== undefined) {
                $scope.scheduleDate = $rootScope.selectedSchedule.startDate;
                $scope.scheduleTime = $rootScope.selectedSchedule.time;
                $scope.repeats = $rootScope.selectedSchedule.repeats;
                $scope.endDate = $rootScope.selectedSchedule.endDate;
                $scope.repeatOn = $rootScope.selectedSchedule.repeatOn;
            }
            if ($scope.repeats !== null || $scope.repeats !== undefined) {
                $scope.repeat = true;
            }
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                var h = $scope.triggereBy;
                $scope.triggereBy = "";
                $scope.$broadcast('resetTriggerBy', {
                    message: "undefined"
                });
                $rootScope.triggereBy = undefined;
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.scheduleDate = new Date();
            $scope.endDate = new Date();

            $scope.timeList = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:30", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];
            $http({
                method: 'GET',
                url: '/components/newPipeline/timezones.json'
            }).then(function (response) {
                $scope.timeZones = response.data;
            });
            $scope.repeatsList = [{
                "value": "daily",
                "option": "Daily"
            }, {
                "value": "weekly",
                "option": "Weekly"
            }, {
                "value": "monthly",
                "option": "Monthly"
            }];

            $scope.weekList = [{
                "value": "monday",
                "option": "M"
            }, {
                "value": "tuesday",
                "option": "T"
            }, {
                "value": "wednesday",
                "option": "W"
            }, {
                "value": "thursday",
                "option": "T"
            }, {
                "value": "friday",
                "option": "F"
            }, {
                "value": "saturday",
                "option": "S"
            }, {
                "value": "sunday",
                "option": "S"
            }];
            $scope.selectedWeeks = function () {
                $scope.repeatOnList = $filter('filter')($scope.weekList, {
                    checked: true
                });
            };
            $scope.startDateChanged = function () {
                $scope.myDatemoment = moment($scope.myDate).format();
            };
            $scope.editScheduleData = function (scheduleDate, scheduleTime, timeZoneModel, repeats, endDate, repeatOn) {

                vm.startDateReq = scheduleDate;
                vm.endDateReq = endDate;


                var startDate = moment(scheduleDate).format('YYYY-MM-DD');
                var endDateVar = moment(endDate).format('Do MMMM YYYY');

                var time = moment(startDate + ' ' + scheduleTime).tz(timeZoneModel).utc().format('HH:mm');

                var repeat;
                if (repeats !== "weekly" && repeats === "monthly") {
                    var monthlyArr = [];
                    monthlyArr.push(moment(scheduleDate).format("DD"));
                    repeat = monthlyArr;
                } else if (repeats !== "weekly" && repeats === "daily") {
                    var dailyArr = [];
                    dailyArr.push("daily");
                    repeat = dailyArr;
                } else {
                    $scope.repeatOn = [];
                    for (var t = 0; t < $scope.repeatOnList.length; t++) {
                        $scope.repeatOn.push($scope.repeatOnList[t].value);
                    }
                    repeat = $scope.repeatOn;
                }
                var obj = {
                    "startDate": startDate,
                    "time": time,
                    "endDate": endDateVar,
                    "repeats": repeats,
                    "repeatOn": repeat
                };

                $rootScope.selectedSchedule = obj;
                $mdDialog.hide();
            };
            $scope.minDate = new Date(
                $scope.scheduleDate.getFullYear(),
                $scope.scheduleDate.getMonth(),
                $scope.scheduleDate.getDate()
                // $scope.endDate.getFullYear(),
                // $scope.endDate.getMonth(),
                // $scope.endDate.getDate()
            );
            $scope.minEndDate = new Date(
                $scope.endDate.getFullYear(),
                $scope.endDate.getMonth(),
                $scope.endDate.getDate()
            );


            $scope.maxDate = new Date(
                $scope.scheduleDate.getFullYear(),
                $scope.scheduleDate.getMonth() + 2,
                $scope.scheduleDate.getDate()
            );
        }

        $scope.submitForm = function (path, editPipeDate, triggereBy, triggeredByOptionValue) {
            $scope.locationKeyChain = false;
            var pipelineID = localStorage.getItem("pipelineID");
            var retrievedData = localStorage.getItem("pipelineStates");
            $scope.pipelineStates = JSON.parse(retrievedData);
            var newStates = [];
            $scope.pipelineStates.forEach(function (element) {
                if (element.stageCateogoriesID && element.stageCateogoriesID.length === 0 || element.stageCateogoriesID === undefined) {
                    newStates.push(element);
                }
                localStorage.removeItem("newStates");
                localStorage.setItem("newStates", JSON.stringify(newStates));
            }, this);
            $scope.editedStates = JSON.parse(localStorage.getItem("newStates"));
            var statesLen = $scope.editedStates.length;

            // create categories
            if ($scope.userForm.$valid && statesLen > 0) {
                $scope.spinner = true;
                getCatData();
            } else if (statesLen === 0) {
                $scope.spinner = true;
                pipelineUpdate();
            }
            var i;

            var dynamicJsonfileName;

            function getCatData() {
                for (i = 0; i < statesLen; i++) {

                    var stateType = $scope.editedStates[i].stageType;
                    var stageID = $scope.editedStates[i].stageID;
                    if (stateType == "verify") {
                        dynamicJsonfileName = "verifyCats";
                        // return cb("verifyCats");
                    } else if (stateType == "build") {
                        dynamicJsonfileName = "buildCats";
                        // return cb("buildCats");
                    } else if (stateType == "environmentTest") {
                        dynamicJsonfileName = "environmentTestCats";
                        // return cb("environmentTestCats");
                    } else if (stateType == "environmentProd") {
                        dynamicJsonfileName = "environmentProdCats";
                        // return cb("environmentProdCats");
                    }
                    addCatDataJsonUrl(stageID);
                }
            }

            function addCatDataJsonUrl(id) {
                var catDataJsonUrl;
                var statid;
                angular.forEach($scope.editedStates, function (el) {
                    if (el.stageID === id) {
                        var index = -1;
                        for (var i = 0, len = $scope.editedStates.length; i < len; i++) {
                            if ($scope.editedStates[i].stageID === el.stageID) {
                                index = i;

                                break;
                            }
                        }
                        el.url = '/components/newPipeline/' + dynamicJsonfileName + '.json';
                        $scope.editedStates.splice(index, 1, el);
                        //
                        catDataJsonUrl = el.url;
                        statid = el.stageID;
                    }
                }, this);
                callAPIs(catDataJsonUrl, statid);
            }

            function callAPIs(url, id) {

                var dfdf = $http({
                    method: 'GET',
                    url: url
                });
                dfdf.then(function (result) {

                        var stateCats = result.data.map(function (stateCat) {
                            var formModelCategory = [];
                            var formModelCategoryconst = stateCat.categoryName.replace(/\s/g, '') + 'Model';
                            var formModelCategoryObj = {
                                "value": formModelCategoryconst
                            };
                            formModelCategory.push(formModelCategoryObj);

                            var catDat = {
                                "categoryName": stateCat.categoryName,
                                "categoryDescription": stateCat.categoryDescription,
                                "categoryForm": stateCat.categoryForm,
                                "categorySchema": stateCat.categorySchema,
                                "formModelCategory": formModelCategory
                            };


                            return $http({
                                    method: 'POST',
                                    url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + id + '/category/',
                                    headers: {
                                        'Authorization': localStorage.getItem("id_token"),
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': "*"
                                    },
                                    data: catDat
                                })
                                .then(function (result) {
                                    return result.data.body;
                                })
                                // fallback value to use when a request fails
                                .catch(function () {
                                    return 'no owner';
                                });
                        });

                        return $q.all(stateCats);
                    })
                    .then(function (response) {

                        var responseStateID;
                        var stateCategoriesIds = [];
                        stateCatsArray(response, function () {});


                        function stateCatsArray(response, cb) {
                            var deferred = $q.defer();
                            var promise = deferred.promise;
                            promise.then(function () {
                                response.forEach(function (obj, i) {

                                    stateCategoriesIds.push(obj.categoryId);
                                    responseStateID = obj.stageID;
                                });
                            }).then(function () {
                                console.log(stateCategoriesIds);
                                var prom = deferred.promise;
                                promise.then(function () {
                                    var found = $scope.editedStates.some(function (el) {
                                        if (el.stageID === responseStateID) {
                                            var index = -1;
                                            for (var i = 0, len = $scope.editedStates.length; i < len; i++) {

                                                if ($scope.editedStates[i].stageID === el.stageID) {
                                                    index = i;
                                                    break;
                                                }
                                            }
                                            el.cats = stateCategoriesIds;
                                            $scope.editedStates.splice(index, 1, el);
                                            for (var k = 0; k < $scope.pipelineStates.length; k++) {
                                                if ($scope.pipelineStates[i].stageID === el.stageID) {
                                                    $scope.pipelineStates[i].cats = el.cats;
                                                }
                                            }
                                        }
                                    });
                                }).then(function () {

                                    // catIds update in states
                                    var stateCatsIds = $scope.editedStates;
                                    var stateCatsIdsUpdate = stateCatsIds.map(function (state) {
                                        var catIds = [];
                                        var m;
                                        if (state.cats) {
                                            var cats = state.cats;
                                            for (m = 0; m < cats.length; m++) {
                                                catIds.push(state.cats[m]);
                                            }
                                        }
                                        var stateDat = {
                                            "stageName": state.stageName,
                                            "stageDescription": state.stageDescription,
                                            "stageCateogories": ["Settings", "preBuild", "Build", "functionTests", "postBuild"],
                                            "stageCategoriesIDs": catIds,
                                            "transitionType": state.transitionType,
                                            "stageType": state.stageType
                                        };

                                        return $http({
                                                method: 'PUT',
                                                url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + state.stageID + '',
                                                headers: {
                                                    'Authorization': localStorage.getItem("id_token"),
                                                    'Content-Type': 'application/json',
                                                    'Access-Control-Allow-Origin': "*"
                                                },
                                                data: stateDat
                                            })
                                            .then(function (result) {
                                                return result.data.body;
                                            })
                                            // fallback value to use when a request fails
                                            .catch(function () {
                                                return 'no owner';
                                            });
                                    });

                                    return $q.all(stateCatsIdsUpdate);
                                }).then(function (response) {
                                    for (var k = 0; k < $scope.pipelineStates.length; k++) {
                                        for (var w = 0; w < response.length; w++) {
                                            if ($scope.pipelineStates[k].stageID === response[w].stageID) {
                                                $scope.pipelineStates[k].stageCateogories = response[w].stageCateogories;
                                                $scope.pipelineStates[k].stageCateogoriesID = response[w].stageCateogoriesID;
                                            }
                                        }
                                    }
                                    var dsf = $scope.pipelineStates;

                                    pipelineUpdate();
                                });

                            });
                            deferred.resolve();
                        }
                    })
                    .catch(function (error) {
                        console.error("something went wrong", error);
                    });

            }

            function pipelineUpdate() {

                // var allStates = JSON.stringify($scope.pipelineStates).replace("]", "").replace("[", "");

                var allStates = $scope.pipelineStates;


                var states = {};
                var i;
                var allStateIds = [];
                var allNextIds = [];
                for (i = 0; i < allStates.length; i++) {
                    var data = allStates[i];
                    allStateIds.push(data.stageID);
                    allNextIds.push(data.Next);

                    if (data.Next) {

                        states['' + data.stageID + ''] = {
                            "tranistionType": '' + data.tranistionType + '',
                            "stageType": '' + data.stageType + '',
                            "Next": '' + data.Next + ''
                        };
                    } else {

                        states['' + data.stageID + ''] = {
                            "tranistionType": '' + data.tranistionType + '',
                            "stageType": '' + data.stageType + '',
                            "End": "true"
                        };
                    }

                }
                Array.prototype.diff = function (a) {
                    return this.filter(function (i) {
                        return a.indexOf(i) < 0;
                    });
                };

                var startAtId = allStateIds.diff(allNextIds);
                $scope.startAt = startAtId[0];

                console.log(states);
                if ($rootScope.selectedSchedule !== undefined) {
                    var scheduleObj = JSON.parse(JSON.stringify($rootScope.selectedSchedule));
                    if (editPipeDate.pipelineSettings.triggeredBy.option === 'schedule') {
                        editPipeDate.pipelineSettings.triggeredBy.value = scheduleObj;
                        editPipeDate.pipelineSettings.triggeredBy.value.startDate = moment(vm.startDateReq).utc().format();
                        editPipeDate.pipelineSettings.triggeredBy.value.endDate = moment(vm.endDateReq).utc().format();
                    }
                }
                var UpdatedPipeline = {
                    "pipelineName": editPipeDate.pipelineName,
                    "pipelineDescription": editPipeDate.pipelineDescription,
                    "projectID": editPipeDate.projectID,
                    "pipelineInfo": {
                        "Comment": "A sample pipeline3",
                        "StartAt": $scope.startAt,
                        "states": states
                    },
                    "pipelineSettings": {
                        "pipelinePermissions": {
                            "pipelineConfigVisibility": editPipeDate.pipelineSettings.pipelinePermissions.pipelineConfigVisibility,
                            "pipielineExecutionVisibility": editPipeDate.pipelineSettings.pipelinePermissions.pipielineExecutionVisibility
                        },
                        "pipelineConcurrentBuildThrottle": editPipeDate.pipelineSettings.pipelineConcurrentBuildThrottle,
                        "triggeredBy": {
                            "option": editPipeDate.pipelineSettings.triggeredBy.option,
                            "value": editPipeDate.pipelineSettings.triggeredBy.value
                        },
                        "pipelineImage": editPipeDate.pipelineSettings.pipelineImage
                    },
                    "pipelinePublished": "Configured"
                };
                var pipelineId = $routeParams.pipelineID;
                $http({
                        method: 'PUT',
                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineId + '',
                        headers: {
                            'Authorization': localStorage.getItem("id_token"),
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': "*"
                        },
                        data: UpdatedPipeline
                    })
                    .then(function (response) {
                        $scope.myWelcome = response.data;
                        $scope.pipelineID = $scope.myWelcome.body.pipelineID;
                        $location.path(path + "/" + $scope.pipelineID + "");
                    });
            }
        };
    }

}());