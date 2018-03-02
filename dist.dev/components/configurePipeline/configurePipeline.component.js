// var jq = $.noConflict();
angular.module('zoneapp')
    .controller('configurePipelineController', configurePipelineController)
    .directive('endRepeatDirective', function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.endRepeatDirective);
                }
            }
        };
    })
    .filter('customArray', function ($filter) {
        return function (list, arrayFilter, element) {
            if (arrayFilter) {
                return $filter("filter")(list, function (listItem) {
                    return arrayFilter.indexOf(listItem[element]) != -1;
                });
            }
        };
    });

configurePipelineController.$inject = ['$scope', '$rootScope', '$filter', 'authService', '$location', '$mdDialog', '$routeParams', '$http', '$q', '$sce', '$mdToast', '$document', '$timeout', '$compile', 'userManage'];

function configurePipelineController($scope, $rootScope, $filter, authService, $location, $mdDialog, $routeParams, $http, $q, $sce, $mdToast, $document, $timeout, $compile, userManage) {

    $scope.model = [];
    var headers = {
        'Authorization': localStorage.getItem("id_token"),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    $scope.pipelineID = $routeParams.pipelineID;
    $scope.showTitle = false;
    var pipelineID = $scope.pipelineID;
    //var pipelineID = localStorage.getItem("pipelineID");

    $scope.pid = $scope.pipelineID;
    localStorage.removeItem('pipelineID');
    // localStorage.removeItem('pipelineStates');

    var vm = this;
    vm.authService = authService;

    localStorage.setItem("expandAccord", true);
    $scope.isExpanded = localStorage.getItem("expandAccord");
    $scope.go = function (path) {
        $location.path(path);
    };
    $scope.open = false;
    $scope.onEnd = function (ev) {

        $timeout(function () {
            var ele;
            var chk = angular.element(".addedRules").find(document.getElementsByClassName("checkbox"));

            // var chk = angular.element(document.getElementsByClassName("checkbox"));
            angular.forEach(chk, function (element) {
                ele = jq(element).find("label");
                jq(ele).append($compile('<div class="rulesActionsBtn"><button class="btn btn-danger" type="button" ng-click="deleteRule($event)"><i class="fa fa-trash-o"></i></button><button class="btn btn-primary" type="button" ng-click="viewRule($event)"><i class="material-icons">visibility</i></button></div>')($scope));
            });

        }, 2000);
    };


    $scope.dirfsOptions = {};
    $scope.dirUtOptions = {};
    $scope.dirScaOptions = {};
    $scope.viewRule = function (ev) {
        $scope.ruleLoading = true;
        var ruleId = jq(ev.currentTarget).parent().parent().find("span.ruleId").text();
        localStorage.setItem("ruleId", ruleId);
        var getCatData = $http({
            method: 'GET',
            url: 'https://veegam.azure-api.net/re/rule/' + ruleId,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                'Authorization': localStorage.getItem("id_token")
            },
        }).then(function (response) {
            localStorage.setItem("ruleId", response.data.id);
            var ruleOfCat = jq(ev.currentTarget).closest(".form-wrapper").find(".rule-type").attr("id");
            $scope.ruleLoading = false;

            if (ruleOfCat == 'ruleEditDirective') {
                $scope.dirfsOptions.directiveFunction(response);
            } else if (ruleOfCat == 'UTruleEditDirective') {
                var element = ev.currentTarget;
                var getCatId = jq(element).closest("v-pane-content").attr('id').replace("-content", '');
                $scope.dirUtOptions.directiveFunction(response, $scope.cats, getCatId);

            } else if (ruleOfCat == 'SCAruleEditDirective') {
                $scope.dirScaOptions.directiveFunction(response);
            }
        });
    };

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
    $scope.spinner = true;

    $scope.setTab = setTab;

    function setTab(tabId, ev) {

        $scope.spinnerCat = true;
        if (ev) {
            jq(".pipeline-item").removeClass("active");
            var jqThis = ev.target;
            jq(jqThis).addClass("active");
        }
        var getCatData = $http({
            method: 'GET',
            url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + tabId + '/category/',
            headers: headers
        });
        getCatData.then(function (response) {

            $scope.cats = response.data.body.Items;
            $scope.spinnerCat = false;
        });
        $scope.tab = tabId;
    }

    function isSet(tabId) {
        return $scope.tab === tabId;
    }
    $scope.isSet = isSet;
    //get pipeline
    var getPipeline = $http({
        'method': 'GET',
        'url': 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '',
        headers: headers
    });
    getPipeline
        .then(function (result) {
            $scope.pipelineData = result.data.body.Item;
            $scope.pipelineInfo = result.data.body.Item.pipelineInfo;
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

            $scope.tab = $scope.stateIds[0];

            var stateId = $scope.stateIds.map(function (stateID) {
                return $http({
                        method: 'GET',
                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + stateID + '',
                        headers: headers
                    })
                    .then(function (result) {
                        return result.data.body.Item;
                    })
                    // fallback value to use when a request fails
                    .catch(function () {
                        return 'no Category';
                    });
            });

            return $q.all(stateId);
        })
        .then(function (response) {

            $scope.states = response;
            var stateIDs = [];
            var i;
            for (i = 0; i < response.length; i++) {
                stateIDs.push(response[i].stageID);
            }
            var stateCatId = stateIDs.map(function (stateID) {
                return $http({
                        method: 'GET',
                        url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + stateID + '/category',
                        headers: headers
                    })
                    .then(function (result) {
                        return result.data.body.Items;
                    })
                    // fallback value to use when a request fails
                    .catch(function () {
                        return 'no Category';
                    });
            });

            return $q.all(stateCatId);

        }).then(function (response) {
            $scope.allCats = response;
            $scope.cats = response[0];
            $scope.spinner = false;
            if (!$scope.spinner) {
                highlightFirstStage();
            }
        });

    $scope.publishLoader = false;
    $scope.publish = function (path) {
        $scope.publishLoader = true;
        var userData = JSON.parse(localStorage.getItem('userProfile'));
        $scope.githubAccessToken = userData.identities[0].access_token;
        var userEmail = JSON.parse(localStorage.getItem("userProfile"));
        debugger;
        $http({
            'method': 'POST',
            'url': 'https://1wzbdzofo9.execute-api.us-west-2.amazonaws.com/dev/publish/' + $scope.pipelineID,
            'headers': headers,
            'data': {
                "ProjectId": $scope.pipelineData.projectID,
                "access_token": $scope.githubAccessToken,
                "refreshCode": localStorage.getItem("refreshToken"),
                "defaultEmail": userEmail.email
            }
        }).then(function (data) {
            $scope.pipelineData.pipelineSettings.pipelineCreatedTime = moment().format('YYYY-MM-DD') + " | " + moment().format('HH:mm');
            $scope.pipelineData.pipelinePublished = "published";
            $http({
                    method: 'PUT',
                    url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '',
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*"
                    },
                    data: $scope.pipelineData
                })
                .then(function (response) {
                    $scope.myWelcome = response.data;
                    $scope.pipelineID = $scope.myWelcome.body.pipelineID;
                    $rootScope.selectedSchedule = {};
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Pipeline activated for trigger!')
                        .position('top center')
                        .hideDelay(3000)
                    );
                    $location.path("/viewPipeline/" + $scope.pipelineID + "");
                });
        });

        //umar code for trigger ends here

    };

    function highlightFirstStage() {
        //add active class to first state by default.
        jq(".record-strip").find("ul li:first-child").find(".pipeline-item").addClass("active");
    }
    // code editor
    $scope.aceLoaded = function (_editor) {
        _editor.setTheme("ace/theme/twilight");
        _editor.getSession().setMode("ace/mode/javascript");
        _editor.getSession().setTabSize(4);
        _editor.getSession().setUseSoftTabs(true);
        _editor.getSession().setUseWrapMode(true);
        _editor.getSession().setOption("useWorker", false);
        $scope.aceSession = _editor.getSession();
        _editor.session.setOption("useWorker", false);
    };
    var aceDocumentValue;
    $scope.aceChanged = function () {
        // function escape(key, val) {
        //     if (typeof(val) != "string") return val;
        //     return val
        //         .replace(/[\r]/g, '');
        // }
        // var getCode = $scope.aceSession.getValue();
        // // var encodeCode = JSON.stringify(getCode, escape, 4).replace(/^"(.*)"$/, '$1');
        // var encodeCode = getCode.replace(/\n/g, '').replace(/^"(.*)"$/, '$1');
        // encodeCode.replace(/\s\s\s\s/g, '\s');
        // localStorage.removeItem("ruleDefination");
        // localStorage.setItem("ruleDefination", encodeCode);
    };
    //predefined testc cases
    $scope.rule = null;
    $scope.rules = null;

    $scope.loadRules = function () {

        // Use timeout to simulate a 650ms request.
        return $timeout(function () {

            $scope.rules = $scope.rules || [{
                    id: 1,
                    name: 'Storage Account best practices',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: Storage Account best practices\r\n\t\tGiven variables.storageAccName is the key\r\n\t\tThen Its value Should contain uniqueString'
                },
                {
                    id: 2,
                    name: 'Password best practices',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: Password best practices\r\n\t\tThen All Password params should not have a defaultvalue property\r\n\t\tThen All password params should have a type property with value securestring\r\n\t\tThen All ssh params should not have a defaultvalue property\r\n\t\tThen All ssh params should have a type property with value securestring'
                },
                {
                    id: 3,
                    name: 'Parameters best practices',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: Parameters best practices\r\n\t\tThen All params should have a lowercase description metadata tag'
                },
                {
                    id: 4,
                    name: 'Resources best practices',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: Resources best practices\r\n\t\tThen All resources should have a tags property\r\n\t\tThen All resources should have a comments property'
                },
                {
                    id: 5,
                    name: 'DNS best practices',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: DNS best practices\r\n\t\tGiven variables.publicIPdns is the key\r\n\t\tThen Its value Should contain uniqueString'
                },
                {
                    id: 6,
                    name: 'Azure Validator',
                    value: '\r\n\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\r\n\tScenario: Validate the Template Against the Azure Validator\r\n\t\tGiven I uploaded the template to Validator\r\n\t\tThen It should return a sucess payload'
                },
                {
                    id: 7,
                    name: 'Key is/not Present',
                    value: '\r\n\t\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\tScenario: Key is\/not Present.\r\n\t\tThen  $schema yes present in the template file\r\n\t\tThen  contentVersion yes present in the template file\r\n\t\tThen  parameters.location.defaultValue yes present in the template file\r\n\t\tThen  testKey no present in the template file\r\n\t\tThen  resources.0.name yes present in the template file\r\n\t\tThen  resources.0.properties.storageProfile.imageReference.sku yes present in the template file\r\n\r\n\t\tGiven I can parse \"\/azuredeploy.parameters.json\" json\r\n\t\tThen  parameters.location.value yes present in the params file\r\n\t\tThen  parameters.vnetName.value yes present in the params file\r\n\t\tThen  testKey1 no present in the params file\r\n\t\tThen  testKey23 no present in the params file'
                },
                {
                    id: 8,
                    name: 'Key has/not a specific value',
                    value: '\t\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist\/azuredeploy.json\" json\r\n\tScenario: Key has\/not a specific value.\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen https:\/\/schema.management.azure.com\/schemas\/2015-01-01\/deploymentTemplate.json# yes be its value\r\n\r\n\t\tWhen contentVersion is the key on template file\r\n\t\tThen 1.0.0.0 yes be its value\r\n\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen testvalue no be its value\r\n\r\n\t\tWhen contentVersion is the key on template file\r\n\t\tThen 1.0.0.1 no be its value\r\n\t\t\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen 10.0.0.0\/16 yes be its value\r\n\r\n\t\tWhen parameters.subnet1Prefix.value is the key on params file\r\n\t\tThen 10.0.1.0\/24 yes be its value\r\n\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen testvalue no be its value\r\n\r\n\t\tWhen parameters.subnet1Prefix.value is the key on params file\r\n\t\tThen testUser no be its value'
                },
                {
                    id: 9,
                    name: 'Key contains a value',
                    value: '\t\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist\/azuredeploy.json\" json\r\n\tScenario: Key contains a value.\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen Its value should contain 2015-01-01\/deploymentTemplate.json\r\n\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen value no contain test\r\n\t\t\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen Its value should contain 0\/16\r\n\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen Its value should contain 0\/18'
                }
            ];

        }, 650);
    };
    $scope.selectedDefaultRule = function () {
        var j = $scope.rule;
        $scope.aceSession.setValue($scope.rule);
        $scope.testData = {
            "caseCode": $scope.rule
        };
    };
    //
    $scope.model = {};
    var allTags = [
        'one',
        'two',
        'three'
    ];

    $scope.queryTags = function (search) {
        var firstPass = $filter('filter')(allTags, search);

        return firstPass.filter(function (item) {
            return $scope.selectedTags.indexOf(item) === -1;
        });
    };

    $scope.selectedTags = [];

    // code editor ends here

    //cat update
    vm.catUpdated = false;
    vm.showSimpleToast = function (catName) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(catName+' is successfully Updated!')
            .position('top center')
            .hideDelay(3000)
        );
    };
    $scope.onSubmit = function (catData, formData, stageID) {
        var catUpdateObj = {
            categoryDescription: catData.categoryDescription,
            categoryForm: catData.categoryForm,
            categoryID: catData.categoryID,
            categoryName: catData.categoryName,
            categorySchema: catData.categorySchema,
            configuredCategory: formData,
            formModelCategory: catData.formModelCategory,
            tenantIDuserIDpipelineIDStageID: catData.tenantIDuserIDpipelineIDStageID
        };
        $http({
            method: 'PUT',
            url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineID + '/stages/' + stageID + '/category/' + catData.categoryID + '',
            headers: headers,
            data: catUpdateObj
        }).then(function (response) {
            vm.catUpdated = true;
            vm.showSimpleToast(response.data.body.categoryName);
        });

    };

    function ruleStringify(RuleData, RuleDataName) {
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        var removeLine = RuleData.replace(/\n/g, "");
        var editorData = JSON.stringify(removeLine).replace(/^"(.*)"$/, '$1');
        var h = JSON.stringify(editorData).replace(/\\r/g, '');
        var rawString, featureData, Datascenario;
        rawString = editorData;
        if (editorData.indexOf('Background:') >= 0) {
            var indexBackground = editorData.indexOf('Background:');
            rawString = rawString.splice(indexBackground, 0, "\\n\\t");

        }
        if (editorData.indexOf('Scenario:') >= 0) {
            var indexScenario = rawString.indexOf('Scenario:');
            //add \n\t\t to Given
            rawString = rawString.splice(indexScenario, 0, "\\n\\t");

        }
        if (editorData.indexOf('Given') >= 0) {
            var indexGiven = rawString.indexOf('Given');
            //add \n\t\t to Given
            rawString = rawString.splice(indexGiven, 0, "\\n\\t\\t");

        }
        if (editorData.indexOf('Then') >= 0) {
            var indexThen = rawString.indexOf('Then');
            //add \n\t\t to Given
            rawString = rawString.splice(indexThen, 0, "\\n\\t\\t");

        }
        if (editorData.indexOf('When') >= 0) {
            var indexWhen = rawString.indexOf('When');
            //add \n\t\t to Given
            rawString = rawString.splice(indexWhen, 0, "\\n\\t\\t");

        }
        var ruleDefinationConcat = "Feature: " + RuleDataName + rawString;
        ruleDefinationConcat.replace(/\n/g, '\\n');
        ruleDefinationConcat.replace(/\t/g, '\\t');
        var ruleDefination = ruleDefinationConcat.replace(/\\r/g, '\\n');
        return ruleDefination;
    }
    //cat update ends here
    $scope.buttonClick = function ($event, form) {

        var element = $event.currentTarget;
        var currentTabId = angular.element(".catStageID").val();
        debugger;
        $scope.validated = false;
        var pipelineAssets;
        var currentTestsCatObject;
        /* 
        pipelineAssets[0] = tenantID
        pipelineAssets[1] = userID
        pipelineAssets[2] = pipelineID
        pipelineAssets[3] = StageID
        */

        var getCatId = jq(element).closest("v-pane-content").attr('id');
        var thisCatId = getCatId.replace("-content", '');
        findCatObject(thisCatId);


        function findCatObject(id) {
            for (var i = 0; i < $scope.allCats.length; i++)
                var found = $scope.allCats[i].some(function (el) {
                    if (el.categoryID === id) {
                        currentTestsCatObject = el;
                        pipelineAssets = el.tenantIDuserIDpipelineIDStageID.split(":");
                        updateTestCase();
                    }
                });
        }

        function updateTestCase() {

            $mdDialog.show({
                templateUrl: '/components/configurePipeline/addUnitTest.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                controller: function ($scope) {

                    $scope.cancel = function () {
                        $mdDialog.hide();
                    };

                    $scope.newTestCaseValidate = newTestCaseValidate;

                    function newTestCaseValidate(testData) {
                        var ruleDefination = ruleStringify(testData.caseCode, testData.caseName);
                        testCaseValidateNCreate(ruleDefination);

                        function testCaseValidateNCreate(ruleDefination) {

                            $scope.validationInProgress = true;
                            // var ruleDefination = localStorage.getItem("ruleDefination");
                            // var ruleDefination = "Feature: Pradeep is testing\\n\\tScenario: Rule Validation API\\n\\t\\tGiven Preadeep hits the validation API\\n\\t\\tThen It should always pass with a valid response";

                            $http({
                                method: 'POST',
                                url: 'https://veegam.azure-api.net/re/rule/validate',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                                    'Authorization': localStorage.getItem("id_token")
                                },
                                data: {
                                    "definition": ruleDefination
                                }
                            }).then(function (response) {
                                $scope.validationInProgress = false;
                                if (response.data === "valid") {
                                    localStorage.removeItem("ruleDefination");
                                    localStorage.setItem("ruleDefination", ruleDefination);
                                    $scope.validated = true;
                                    $scope.validRule = true;
                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.validRule = false;
                                        });
                                    }, 4000);
                                } else {
                                    $scope.invalidRule = true;

                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.invalidRule = false;
                                        });
                                    }, 4000);
                                }
                            });
                        }
                    }
                    $scope.ruleCreateLoader = false;
                    $scope.newTestCaseDetails = newTestCaseDetails;

                    function newTestCaseDetails(testData) {
                        $scope.ruleCreateLoader = true;
                        var ruleDefination = ruleStringify(testData.caseCode, testData.caseName);
                        var caseData = {
                            "name": testData.caseName,
                            "description": testData.caseDescription,
                            "rule_type": "string",
                            "error_type": testData.caseType,
                            "tags": testData.selectedTags,
                            "definition": ruleDefination,
                            "permissions": testData.publishSettings
                        };

                        $http({
                            method: 'POST',
                            url: 'https://veegam.azure-api.net/re/rule',
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                                'Authorization': localStorage.getItem("id_token")
                            },
                            data: caseData
                        }).then(function (response) {

                            var type = "checkboxes";
                            $scope.currentTestsCatObject = currentTestsCatObject;
                            findRulesListObject(type);

                            function findRulesListObject(id) {
                                var found = $scope.currentTestsCatObject.categoryForm.some(function (el) {
                                    if (el.type === id) {
                                        $scope.currentRuleObject = el;
                                    }
                                });
                            }
                            var ruleObj = {
                                "value": response.data,
                                "name": response.config.data.name + '<span class="ruleId">' + response.data + '</span>'
                            };
                            $scope.currentRuleObject.titleMap.push(ruleObj);
                            $scope.currentTestsCatObject.categorySchema.properties.testCases.default.push(response.data);
                            $scope.currentTestsCatObject.categorySchema.properties.testCases.items.enum.push(response.data);

                            $http({
                                method: 'PUT',
                                url: 'https://veegam.azure-api.net/veegam/pipelines/' + pipelineAssets[2] + '/stages/' + pipelineAssets[3] + '/category/' + currentTestsCatObject.categoryID + '',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Ocp-Apim-Subscription-Key': '2db7c591acc84ebfa0e7756ee1ded67b',
                                    'Authorization': localStorage.getItem("id_token")
                                },
                                data: $scope.currentTestsCatObject
                            }).then(function (response) {
                                $http({
                                    method: 'GET',
                                    url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineAssets[2] + '/stages/' + pipelineAssets[3] + '/category/',
                                    headers: headers
                                }).then(function (response) {
                                    $scope.cats = response.data.body.Items;
                                    $scope.form = angular.copy($scope.currentTestsCatObject);
                                    // $scope.$broadcast('schemaFormRedraw');
                                    // $scope.$apply();

                                    setTab(currentTabId);

                                    $mdDialog.hide();
                                });
                            });
                        });
                    }
                }

            });
        }
    };


    $scope.deleteRule = function (ev) {
        var ruleId = jq(ev.currentTarget).parent().parent().find("span.ruleId").text();

        var pipelineAssets;
        var currentTestsCatObject;
        /* 
        pipelineAssets[0] = tenantID
        pipelineAssets[1] = userID
        pipelineAssets[2] = pipelineID
        pipelineAssets[3] = StageID
        */
        var currentEl = ev.currentTarget;
        var thisCatId = jq(currentEl).closest("v-pane-content").attr('id').replace("-content", '');
        findCatObject(thisCatId);

        function findCatObject(id) {
            for (var i = 0; i < $scope.allCats.length; i++)
                var found = $scope.allCats[i].some(function (el) {
                    if (el.categoryID === id) {
                        currentTestsCatObject = el;
                        pipelineAssets = el.tenantIDuserIDpipelineIDStageID.split(":");
                    }
                });
        }
        $scope.currentTestsCatObject = currentTestsCatObject;
        findRulesListObject("checkboxes");

        function findRulesListObject(id) {

            var found = $scope.currentTestsCatObject.categoryForm.some(function (el) {
                if (el.type === id) {
                    $scope.currentRuleObject = el;
                }
            });
        }

        deleteTitlemapRuleObject(ruleId);

        function deleteTitlemapRuleObject(ruleId) {

            var found = $scope.currentRuleObject.titleMap.some(function (el) {
                if (el.value === ruleId) {
                    var currentRuleIndex = $scope.currentRuleObject.titleMap.indexOf(el);
                    $scope.currentRuleObject.titleMap.splice(currentRuleIndex, 1);

                }
            });
        }
        deletecategorySchemaRuleObject(ruleId);

        function deletecategorySchemaRuleObject(ruleId) {
            var defaultObject = $scope.currentTestsCatObject.categorySchema.properties.testCases.default;
            var enumObject = $scope.currentTestsCatObject.categorySchema.properties.testCases.items.enum;
            defaultObject.splice(defaultObject.indexOf(ruleId), 1);
            enumObject.splice(enumObject.indexOf(ruleId), 1);
        }
        $http({
            method: 'DELETE',
            url: 'https://veegam.azure-api.net/re/rule/' + ruleId,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                'Authorization': localStorage.getItem("id_token")
            }

        }).then(function (response) {


            $http({
                method: 'PUT',
                url: 'https://veegam.azure-api.net/veegam/pipelines/' + pipelineAssets[2] + '/stages/' + pipelineAssets[3] + '/category/' + currentTestsCatObject.categoryID + '',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': '2db7c591acc84ebfa0e7756ee1ded67b',
                    'Authorization': localStorage.getItem("id_token")
                },
                data: $scope.currentTestsCatObject
            }).then(function (response) {
              //  alert("success");
            });
        });

    };

}

angular.module('zoneapp').filter("orderStates", function ($filter) {
    return function (input, states) {

        var dinput = input;
        var pipelineStateIds = localStorage.getItem("orderedStates");
        var sortById = pipelineStateIds.split(",");
        var orderedCats = [];
        var c;
        for (c = 0; c < sortById.length; c++) {
            var stagID = sortById[c];
            orderedCats.push(stagID);
        }
        var sortBy = orderedCats;
        var ordered = [];
        if (sortBy) {

            for (var i = 0; i < sortBy.length; i++) {
                var sortByCat = sortBy[i];
                for (var j = 0; j < dinput.length; j++) {
                    if (input[j].stageID == sortByCat) {
                        ordered.push(dinput[j]);
                    }
                }
            }
        }
        return ordered;
    };
});

angular.module('zoneapp').filter("orderCats", function () {
    return function (input, sortBy) {
        var dinput = input;
        var ordered = [];
        if (dinput) {
            for (var i = 0; i < sortBy.length; i++) {
                var sortByCat = sortBy[i];
                for (var j = 0; j < dinput.length; j++) {
                    if (input[j].categoryID == sortByCat) {
                        ordered.push(dinput[j]);
                    }
                }
            }
            return ordered;
        }
    };
});