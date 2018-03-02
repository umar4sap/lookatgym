angular.module('zoneapp')

    .controller("editPipelineDirController", ['$scope', '$mdDialog', '$compile', '$rootScope', '$routeParams', function ($scope, $mdDialog, $compile, $rootScope, $routeParams) {
        var vm = this;
        $scope.ind = 1;
    }])
    .directive('editPipeline', function ($mdDialog, $http, $routeParams) {
        return {
            restrict: 'AE',
            scope: {
                item: '=item',
                stateInfo: '=info',
                openoffscreen: "&"
            },
            template: '<div class="record-strip" flex="100" layout="row">' +
                '<md-card layout="row" flex="100" layout-xs="column" class="highlight no-margin">' +
                '<md-button class="" ng-click="addState(event, item)" ng-if="initadd">+</md-button><ci-spinner ng-if="statesLoaded"></ci-spinner>' +
                '<div ng-app="app" ng-controller="editPipelineDirController as ctrl" layout="row"><div ng-repeat="item in pipelineStates | orderBy:' + '\'stageOrder\'' + '" >' +
                '<div layout="row" layout-align="space-between start" class="state {{item.tranistionType}} "><md-button ng-click="remove($event,item)" ng-if="!item.start">x</md-button>' +
                '<div layout="column" layout-align="center center" style="height: 100%;">' +
                '<div class="pipeline-item" layout="row" layout-align="center center">' +
                '<span>P</span>' +
                '</div>' +
                '<span class="md-caption"layout="row" layout-align="center center">{{item.stageName}}<md-button ng-click="editStage($event,item)" ng-if="!item.start"><i class="material-icons">mode_edit</i></md-button></span>' +
                '</div>' +
                '<md-button class="" ng-click="addState(event, item)" ng-if="!item.end">+</md-button></div></div>' +
                '</div></md-card></div>',
            link: function (scope, element, attrs) {
                var headers = {
                    'Authorization': localStorage.getItem("id_token"),
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                };
                scope.statesLoaded = true;

                scope.pipelineID = $routeParams.pipelineID;
                if (localStorage.getItem("pipelineID") === null) {

                    localStorage.removeItem("pipelineStates");

                }
                if (localStorage.getItem("pipelineStates") === null) {

                    localStorage.setItem("pipelineStates", JSON.stringify([]));
                }
                scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                scope.initadd = false;
                scope.statesLoaded = false;
                // var retrievedData = localStorage.getItem("pipelineStates");
                // var parsedPipelineStates = JSON.parse(retrievedData);
                // scope.pipelineStates = parsedPipelineStates;

                // scope.initadd = true;
                var pipelineID, stageID;
                //add State
                scope.addState = function (event, item) {

                    $mdDialog.show({

                        templateUrl: '/directives/create-pipeline/stage-select-dialog.template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        controller: function ($scope) {
                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };

                            $scope.getData = function (stateData) {
                                
                                $scope.spinner = true;

                                if (localStorage.getItem("pipelineID") !== null) {
                                    pipelineID = JSON.parse(localStorage.getItem("pipelineID"));
                                }
                                var stageBuild = ["buildSettings", "functionalTests"];
                                var stageVerify = ["verifySettings", "preVerifyTasks", "unitTests", "codeAnalysis", "postVerifyTasks"];
                                var stageEnvironmentTest = ["envSettings", "configureparameters", "functionalTests", "integrationTests"];
                                var stageEnvironmentProd = ["envSettings", "configureparameters", "smokeTests"];

                                var stageCateogories = function () {
                                    switch (stateData.stateType) {
                                        case 'verify':
                                            return stageVerify;
                                        case 'build':
                                            return stageBuild;
                                        case 'environmentTest':
                                            return stageEnvironmentTest;
                                        case 'environmentProd':
                                            return stageEnvironmentProd;
                                    }
                                };


                                // create stage
                                $http({
                                        method: 'POST',
                                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages',
                                        headers: headers,
                                        data: {
                                            "stageName": stateData.pipelineitemfullname,
                                            "stageDescription": stateData.stageDescription,
                                            "stageCateogories": stageCateogories(),
                                            "transitionType": stateData.choice,
                                            "stageType": stateData.stateType,
                                            "stageCateogoriesID": []

                                        }
                                    })
                                    .then(function (response) {
                                        stageID = response.data.body.stageID;
                                        // var stateObj = [];
                                        // stateObj.push(response.data.body);
                                        // localStorage.setItem('pipelineStates', JSON.stringify(stateObj));
                                        scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));

                                        var obj = {
                                            "tranistionType": stateData.choice,
                                            "stageType": stateData.stateType,
                                            "stageName": stateData.pipelineitemfullname,
                                            "Next": "end",
                                            "stateDescription": stateData.stageDescription,
                                            "stageID": stageID
                                        };
                                        // if (scope.pipelineStates.length === 0) {
                                        //     scope.pipelineStates.push(obj);
                                        //     localStorage.setItem("pipelineStates", JSON.stringify(scope.pipelineStates));
                                        // }
                                        // scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));


                                        // if (scope.pipelineStates !== null && scope.pipelineStates.length > 0) {
                                        //     var i;
                                        //     var index;

                                        //     for (index = 0; index < scope.pipelineStates.length; index++) {
                                        //         if (scope.pipelineStates[index].stageID === item.stageID) {
                                        //             i = index;
                                        //         }
                                        //     }
                                        //     var CurrentAI = scope.pipelineStates[i];
                                        //     var currentIndex;
                                        //     var nextElement;
                                        //     if (i !== -1) {
                                        //         CurrentAI.Next = stageID;
                                        //         currentIndex = i + 1;
                                        //         nextElement = currentIndex + 1;
                                        //     }
                                        //     // var index = scope.pipelineStates.indexOf(item);
                                        //     scope.pipelineStates.splice(i + 1, 0, obj);

                                        //     if (scope.pipelineStates.length == nextElement) {
                                        //         var rmEnd = scope.pipelineStates[i];
                                        //         delete rmEnd.End;
                                        //     }
                                        //     if (scope.pipelineStates.length > nextElement) {
                                        //         scope.pipelineStates[currentIndex - 1].Next = scope.pipelineStates[nextElement - 1].stageName;
                                        //     }
                                        //     var arrLenght = scope.pipelineStates.length;
                                        //     var lastStateIndex = arrLenght - 1;
                                        //     var lastState = scope.pipelineStates[lastStateIndex];

                                        //     if (lastState !== undefined) {
                                        //         delete lastState.Next;
                                        //         lastState.End = "true";
                                        //     }
                                        //     localStorage.removeItem("pipelineStates");
                                        //     localStorage.setItem("pipelineStates", JSON.stringify(scope.pipelineStates));
                                        //     scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                                        //     if (scope.pipelineStates.length === 0) {
                                        //         scope.initadd = true;
                                        //     } else { scope.initadd = false; }
                                        // } else {
                                        //     obj.stageCateogories = response.data.body.stageCateogories;
                                        //     obj.stageCateogoriesID = response.data.body.stageCateogoriesID;
                                        //     obj.End = "true";
                                        //     delete obj.Next;
                                        //     var pipelineStates = [];
                                        //     pipelineStates.push(obj);
                                        //     
                                        //     localStorage.removeItem("pipelineStates");
                                        //     localStorage.setItem("pipelineStates", JSON.stringify(pipelineStates));
                                        //     scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                                        //     if (scope.pipelineStates.length === 0) {
                                        //         scope.initadd = true;
                                        //     } else { scope.initadd = false; }
                                        // }

                                        // if (scope.pipelineStates !== null && scope.pipelineStates.length >= 0) {
                                        //     
                                        //    var i;

                                        //     for (var ind = 0; ind < scope.pipelineStates.length; ind++) {
                                        //         if (scope.pipelineStates[ind].stageID === item.stageID) {
                                        //             i = ind;
                                        //         }
                                        //     }
                                        //     var CurrentAI = scope.pipelineStates[i];
                                        //     var currentIndex;
                                        //     var nextElement;
                                        //     if (i !== -1 && i !== undefined) {
                                        //         CurrentAI.Next = stageID;

                                        //         currentIndex = i + 1;
                                        //         nextElement = currentIndex + 1;

                                        //     }else{
                                        //         obj.End = "true";
                                        //         delete obj.Next;
                                        //         currentIndex = i + 1;
                                        //         nextElement = currentIndex + 1;

                                        //     }
                                        //     for (var parentIndex = 0; parentIndex < scope.pipelineStates.length; parentIndex++) {
                                        //         if (scope.pipelineStates[parentIndex].stageID === item.stageID) {
                                        //             $scope.parentIndex = parentIndex;
                                        //         }
                                        //     }   
                                        //     scope.pipelineStates.splice($scope.parentIndex + 1, 0, obj);
                                        //         for(var g=0;g<scope.pipelineStates.length;g++){
                                        //             if(scope.pipelineStates[g].stageID === stageID){
                                        //                 $scope.addingState = {obj:scope.pipelineStates[g],index:g}
                                        //             }
                                        //         }
                                        //     if (scope.pipelineStates.length == nextElement) {
                                        //         var rmEnd = scope.pipelineStates[i];
                                        //         delete rmEnd.End;       
                                        //         // var prevStageOrder;
                                        //         // var nextStageOrder;
                                        //         // if('stageOrder' in scope.pipelineStates[i-1]){
                                        //         //     prevStageOrder = scope.pipelineStates[i-1].stageOrder > CurrentAI.stageOrder;
                                        //         // }
                                        //         // if('stageOrder' in scope.pipelineStates[i+1]){
                                        //         //     nextStageOrder = scope.pipelineStates[i+1].stageOrder > CurrentAI.stageOrder;
                                        //         // }
                                        //         delete $scope.addingState.obj.Next;
                                        //         $scope.addingState.obj.End = "true";


                                        //         if(Number.isInteger(+CurrentAI.stageOrder) === false ){
                                        //         // if(prevStageOrder || nextStageOrder){

                                        //             $scope.addingState.obj.stageOrder = inMidOrder($scope.addingState.index);
                                        //             function inMidOrder(ci){
                                        //                 // ci = '.'+ci;
                                        //                 var currentOrder = CurrentAI.stageOrder.replace(/\"/g, "") + ci;
                                        //                 return '' + currentOrder + '';
                                        //             }
                                        //         }else{
                                        //         var currentOrder = +CurrentAI.stageOrder + 1;
                                        //        $scope.addingState.obj.stageOrder = ''+currentOrder+'' ;
                                        //         }

                                        //     }
                                        //     if (scope.pipelineStates.length > nextElement) {
                                        //         $scope.addingState.obj.Next = scope.pipelineStates[nextElement].stageID;
                                        //         if(Number.isInteger(+CurrentAI.stageOrder) === false){

                                        //             $scope.addingState.obj.stageOrder = inMidOrder(currentIndex);
                                        //             function inMidOrder(ci){
                                        //                 // ci = '.'+ci;
                                        //                 var currentOrder = CurrentAI.stageOrder.replace(/\"/g, "") + ci;
                                        //                 return '' + currentOrder + '';
                                        //             }
                                        //         }else{
                                        //         $scope.addingState.obj.stageOrder = '' + CurrentAI.stageOrder +'.' + currentIndex + '';
                                        //         }
                                        //     }
                                        //     var arrLenght = scope.pipelineStates.length;
                                        //     var lastStateIndex = arrLenght - 1;
                                        //     // var lastState = scope.pipelineStates[lastStateIndex];
                                        //         scope.pipelineStates.forEach(function(element) {
                                        //             
                                        //             if("End" in element){
                                        //                 $scope.lastState = element;
                                        //             }
                                        //         }, this);

                                        //     if ($scope.lastState !== undefined) {
                                        //         delete $scope.lastState.Next;
                                        //         $scope.lastState.End = "true";
                                        //         $scope.lastState.stageOrder = ''+arrLenght+'';

                                        //     }
                                        //     localStorage.setItem("pipelineStates", JSON.stringify(scope.pipelineStates));

                                        // if (scope.pipelineStates.length === 0) {
                                        //     obj.stageOrder = "0";
                                        // }

                                        if (scope.pipelineStates !== null && scope.pipelineStates.length > 0) {
                                            var i;
                                            for (var ind = 0; ind < scope.pipelineStates.length; ind++) {
                                                if (scope.pipelineStates[ind].stageID === item.stageID) {
                                                    i = ind;
                                                }
                                            }
                                            var CurrentAI = scope.pipelineStates[i];
                                            var currentIndex;
                                            var nextElement;
                                            if (i !== -1) {
                                                CurrentAI.Next = stageID;

                                                currentIndex = i + 1;
                                                nextElement = currentIndex + 1;

                                            }
                                            // var index = scope.pipelineStates.indexOf(item);
                                            scope.pipelineStates.splice(i + 1, 0, obj);

                                            if (scope.pipelineStates.length == nextElement) {
                                                var rmEnd = scope.pipelineStates[i];
                                                delete rmEnd.End;
                                                // var currentOrder = CurrentAI.stageOrder + 1;
                                                // scope.pipelineStates[currentIndex].stageOrder = '' + currentOrder + '';

                                            }
                                            if (scope.pipelineStates.length > nextElement) {
                                                scope.pipelineStates[currentIndex].Next = scope.pipelineStates[nextElement].stageID;
                                                // if (Number.isInteger(CurrentAI.stageOrder) == false) {

                                                //     scope.pipelineStates[currentIndex].stageOrder = inMidOrder(currentIndex);

                                                //     function inMidOrder(ci) {
                                                //         ci = '.' + ci;
                                                //         var currentOrder = (CurrentAI.stageOrder.replace(/\"/g, "")) + (ci.replace(/\"/g, ""));
                                                //         return '' + currentOrder + '';
                                                //     }
                                                // } else {
                                                //     scope.pipelineStates[currentIndex].stageOrder = '' + CurrentAI.stageOrder + '.' + currentIndex + '';
                                                // }
                                            }
                                            var arrLenght = scope.pipelineStates.length;
                                            var lastStateIndex = arrLenght - 1;
                                            var lastState = scope.pipelineStates[lastStateIndex];

                                            if (lastState !== undefined) {
                                                delete lastState.Next;
                                                lastState.End = "true";
                                                // lastState.stageOrder = '' + arrLenght + '';

                                            }

                                        } else {
                                            obj.stageCateogories = response.data.body.stageCateogories;
                                            obj.stageCateogoriesID = response.data.body.stageCateogoriesID;
                                            obj.End = "true";
                                            delete obj.Next;
                                            var pipelineStates = [];
                                            pipelineStates.push(obj);
                                            
                                            localStorage.removeItem("pipelineStates");
                                            localStorage.setItem("pipelineStates", JSON.stringify(pipelineStates));
                                            scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                                            if (scope.pipelineStates.length === 0) {
                                                scope.initadd = true;
                                            } else { scope.initadd = false; }
                                        }

                                        var allStateIds = [];
                                        var allNextIds = [];
                                        for (var l = 0; l < scope.pipelineStates.length; l++) {
                                            var data = scope.pipelineStates[l];
                                            allStateIds.push(data.stageID);
                                            allNextIds.push(data.Next);
                                        }
                                        Array.prototype.diff = function (a) {
                                            return this.filter(function (f) {
                                                return a.indexOf(f) < 0;
                                            });
                                        };
                                        
                                        var startAtId = allStateIds.diff(allNextIds);
                                        $scope.startAt = startAtId[0];
                                        for (var u = 0; u < scope.pipelineStates.length; u++) {
                                            if (scope.pipelineStates[u].stageID === $scope.startAt) {
                                                scope.pipelineStates[u].stageOrder = u;
                                                $scope.startAt = scope.pipelineStates[u].Next;
                                            }

                                        }
                                        localStorage.removeItem("pipelineStates");
                                        localStorage.setItem("pipelineStates", JSON.stringify(scope.pipelineStates));
                                        var pipelineStatesLength = scope.pipelineStates.length;
                                        if (pipelineStatesLength === 0) {
                                            scope.initadd = true;
                                        } else {
                                            scope.initadd = false;
                                        }
                                        $mdDialog.hide();
                                    }); // create state ends here
                            };
                            // getData ends here

                        }
                    });

                }; //add state ends here

                if (scope.pipelineStates) {
                    var pipelineStatesLength = scope.pipelineStates.length;
                    if (pipelineStatesLength === 0) {
                        scope.initadd = true;
                    } else {
                        scope.initadd = false;
                    }
                }

                //editState
                scope.editStage = function ($event, item) {
                    scope.nextStateId = item.Next;
                    
                    $mdDialog.show({

                        templateUrl: '/directives/editPipeline/stage-select-dialog.template.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        controller: function ($scope) {
                            $scope.nextStateId = item;
                            $scope.stateDialogData = false;
                            $scope.hide = function () {
                                $mdDialog.hide();
                            };
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };
                            $scope.pipelineID = $routeParams.pipelineID;
                            $http({
                                method: 'GET',
                                url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + $scope.pipelineID + '/stages/' + item.stageID,
                                headers: headers
                            }).then(function (response) {
                                $scope.stateDialog = response.data.body.Item;
                                $scope.stateDialog.pipelineitemfullname = $scope.stateDialog.stageName;
                                $scope.stateDialog.choice = "stage";
                                $scope.stateDialog.stateType = $scope.stateDialog.stageType;
                                $scope.stateDialog.stageDescription = $scope.stateDialog.stageDescription;
                                $scope.stateDialogData = true;
                                $scope.stageOrder = response.data.body.Item.stageOrder;

                            });


                            $scope.updateState = function (stateDialog) {
                                $scope.spinner = true;

                                // update stage
                                $http({
                                        method: 'PUT',
                                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + $scope.pipelineID + '/stages/' + item.stageID,
                                        headers: headers,
                                        data: {
                                            "stageName": stateDialog.pipelineitemfullname,
                                            "stageDescription": stateDialog.stageDescription,
                                            "stageCateogories": stateDialog.stageCateogories,
                                            "transitionType": stateDialog.choice,
                                            "stageType": stateDialog.stateType,
                                            "stageCateogoriesID": stateDialog.stageCateogoriesID,
                                            "stageOrder": stateDialog.stageOrder
                                        }
                                    })
                                    .then(function (response) {
                                        var we = item;
                                        var obj = {
                                            "stageName": response.data.body.stageName,
                                            "stageDescription": stateDialog.stageDescription,
                                            "stageCateogories": stateDialog.stageCateogories,
                                            "transitionType": stateDialog.choice,
                                            "stageType": stateDialog.stateType,
                                            "stageCateogoriesID": stateDialog.stageCateogoriesID,
                                            "stageOrder": stateDialog.stageOrder,
                                            "stageID": response.data.body.stageID,
                                        };
                                        if ("Next" in item) {
                                            obj.Next = item.Next;
                                        } else {
                                            obj.End = item.End;
                                        }
                                        var pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                                        var objInd;
                                        for (var t = 0; t < pipelineStates.length; t++) {
                                            if (pipelineStates[t].stageID === item.stageID) {
                                                objInd = t;
                                            }
                                        }
                                        pipelineStates.splice(objInd, 1, obj);
                                        localStorage.removeItem("pipelineStates");
                                        localStorage.setItem("pipelineStates", JSON.stringify(pipelineStates));
                                        
                                        $mdDialog.hide();
                                    });
                            };
                            // getData ends here

                        }
                    });
                };
                scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));


                // delete state

                scope.remove = function (ev, item) {
                    scope.pipelineStates = JSON.parse(localStorage.getItem("pipelineStates"));
                    scope.pipelineID = $routeParams.pipelineID;
                    $http({
                        method: 'DELETE',
                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + scope.pipelineID + '/stages/' + item.stageID + '',
                        headers: headers
                    }).then(function (response) {
                        var index;
                        for (var ind = 0; ind < scope.pipelineStates.length; ind++) {
                            if (scope.pipelineStates[ind].stageID === item.stageID) {
                                index = ind;
                            }
                        }
                        // var index = scope.pipelineStates.indexOf(item);
                        // var arrObj = scope.pipelineStates;
                        // var arrObjLength = arrObj.length;
                        // var prevIndex = index - 1;
                        // var nextIndex = index + 1;
                        // if (arrObjLength > nextIndex && prevIndex >= 0) {
                        //     arrObj[prevIndex].Next = arrObj[nextIndex].stageID;
                        //     var j = scope.pipelineStates;
                        // } else if (arrObjLength = nextIndex && prevIndex >= 0) {
                        //     arrObj[prevIndex].End = "true";
                        //     delete arrObj[prevIndex].Next;
                        // }

                        for (var k = 0; k < scope.pipelineStates.length; k++) {
                            if (scope.pipelineStates.length > index && scope.pipelineStates[index].Next === scope.pipelineStates[k].stageID) {
                                scope.pipelineStates[index-1].Next = scope.pipelineStates[k].stageID;
                            }
                        }

                        scope.pipelineStates.splice(index, 1);
                        
                        // var ele = jq(angular.element(ev.currentTarget));
                        // jq(ele).closest(".state").parent().addClass("removed-state");
                        
                        var allStateIds = [];
                        var allNextIds = [];
                        for (var l = 0; l < scope.pipelineStates.length; l++) {
                            var data = scope.pipelineStates[l];
                            allStateIds.push(data.stageID);
                            allNextIds.push(data.Next);
                        }
                        Array.prototype.diff = function (a) {
                            return this.filter(function (f) {
                                return a.indexOf(f) < 0;
                            });
                        };
                        
                        var startAtId = allStateIds.diff(allNextIds);
                        scope.startAt = startAtId[0];
                        for (var u = 0; u < scope.pipelineStates.length; u++) {
                            if (scope.pipelineStates[u].stageID === scope.startAt) {
                                scope.pipelineStates[u].stageOrder = u;
                                scope.startAt = scope.pipelineStates[u].Next;
                            }

                        }
                        localStorage.removeItem("pipelineStates");
                        localStorage.setItem("pipelineStates", JSON.stringify(scope.pipelineStates));


                        $http({
                            method: 'GET',
                            url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + scope.pipelineID,
                            headers: headers
                        }).then(function (response) {
                            var pipData = response.data.body.Item;
                            if (item.stageID === pipData.pipelineInfo.StartAt) {
                                pipData.pipelineInfo.StartAt = pipData.pipelineInfo.states[item.stageID].Next;
                            }
                            delete pipData.pipelineInfo.states[item.stageID];
                            
                            $http({
                                    method: 'PUT',
                                    url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + scope.pipelineID,
                                    headers: headers,
                                    data: pipData
                                })
                                .then(function (response) {
                                    if (scope.pipelineStates.length === 0) {
                                        scope.initadd = true;
                                    } else {
                                        scope.initadd = false;
                                    }
                                });
                        });

                    });
                };
            }
        };

    });