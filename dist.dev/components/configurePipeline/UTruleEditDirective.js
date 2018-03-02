angular.module('zoneapp')

    .directive('utruleViewDirective', function ($http) {

        return {
            templateUrl: 'components/configurePipeline/UTruleViewDirective.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: '='
            },
            link: function (scope, element) {

                scope.utruleViewDirectiveShow = false;
                angular.extend(scope.options, {
                    directiveFunction: function (we, cats, catId) {
                        var rawDefination = (we.data.versions[0].definition).replace(/\\n/g, "\n");
                        var def = rawDefination.replace(/\\t/g, '\t');
                        var defination = def.replace(/\\/g, '');

                        scope.utruleViewDirectiveShow = true;
                        var editor = ace.edit("utruleViewDirective");

                        editor.setTheme("ace/theme/chrome");
                        editor.getSession().setMode("ace/mode/javascript");
                        editor.getSession().setTabSize(4);
                        editor.getSession().setUseWrapMode(true);
                        editor.setFontSize("13px");
                        editor.resize();
                        editor.getSession().setUseWorker(false);
                        editor.session.setValue(defination);
                        editor.setReadOnly(true);

                        scope.caseName = we.data.versions[0].name;
                        scope.caseDescription = we.data.versions[0].description;
                        scope.publishSettings = we.data.versions[0].permissions;
                        scope.caseType = we.data.versions[0].error_type;
                        scope.cats = cats;
                        scope.catId = catId;
                    }
                });
            },
            controller: 'utruleEditDirectivectrl'
        };

    })
    .directive('utruleEditDirective', function ($mdDialog, $http, $mdToast) {

        return {
            templateUrl: 'components/configurePipeline/UTruleEditDirectiveTemplate.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: '='
            },
            link: function (scope) {
                scope.directiveCtrlCalled = false;
                angular.extend(scope.options, {
                    directiveFunc: function (we, cats, catId) {

                        var ruleRaw = we.definition.split('\\t');
                        ruleRaw.splice(0, 1);
                        var ruleParsed = ruleRaw.join().replace(/,/g, '\\t');

                        var rawDefination = (ruleParsed).replace(/\\n/g, "\n");
                        var def = rawDefination.replace(/\\t/g, '\t');
                        var defination = def.replace(/\\/g, '');

                        scope.directiveCtrlCalled = true;
                        var editor = ace.edit("utruleEditDirective");
                        editor.setTheme("ace/theme/monokai");
                        editor.getSession().setMode("ace/mode/javascript");
                        editor.getSession().setTabSize(4);
                        editor.getSession().setUseWrapMode(true);
                        editor.setFontSize("13px");
                        editor.resize();
                        editor.getSession().setUseWorker(false);

                        editor.session.setValue(defination);
                        editor.getSession().on('change', function (e) {
                            scope.validated = false;
                        });
                        editor.getSession().selection.on('changeCursor', function (e) {
                            scope.validated = false;
                        });
                        editor.getSession().selection.on('changeSelection', function (e) {
                            scope.validated = false;
                        });
                        scope.editdata = {
                            "caseName": we.name,
                            "caseDescription": we.description,
                            "publishSettings": we.permissions,
                            "caseType": we.error_type
                        };
                        var headers = {
                            'Authorization': localStorage.getItem("id_token"),
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': "*"
                        };

                        //close Dialog
                        scope.closeDialog = function () {
                            $mdDialog.hide();
                        };

                        function escapeRulecode(ruleCode, ruleName){
                            String.prototype.splice = function (idx, rem, str) {
                                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                            };
                            var editorData = JSON.stringify(ruleCode).replace(/^"(.*)"$/, '$1').replace(/\\t/g, " ").replace(/\\n/g, " ").replace(/\\n/g, " ");

                            if (editorData.indexOf('Background:') >= 0) {
                                editorData = editorData.replace(/Background/g, "\\n\\tBackground");
                            }
                            if (editorData.indexOf('Scenario:') >= 0) {
                                editorData = editorData.replace(/Scenario/g, "\\n\\tScenario");
                            }
                            if (editorData.indexOf('Given') >= 0) {
                                editorData = editorData.replace(/Given/g, "\\n\\t\\tGiven");
                            }
                            if (editorData.indexOf('Then') >= 0) {
                                editorData = editorData.replace(/Then/g, "\\n\\t\\tThen");
                            }
                            if (editorData.indexOf('When') >= 0) {
                                editorData = editorData.replace(/When/g, "\\n\\t\\tWhen");
                            }
                            var definationConcat = ("Feature: " + ruleName + editorData)
                            var defination = definationConcat.replace(/\\r/g, '\\n').replace(/\\"/g, '\"');
                            debugger;
                            return defination;
                        }


                        // vaidate rule
                        var ruleDefination;
                        scope.updatedTestCaseValidate = function (validateTestData) {

                            var CaseCode = editor.getSession().getValue();

                            var defination = escapeRulecode(CaseCode, validateTestData.caseName);


                            scope.validationInProgress = true;
                            $http({
                                method: 'POST',
                                url: 'https://veegam.azure-api.net/re/rule/validate',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                                    'Authorization': localStorage.getItem("id_token")
                                },
                                data: {
                                    "definition": defination
                                }
                            }).then(function (response) {

                                scope.validationInProgress = false;

                                if (response.data === "valid") {
                                    scope.validated = true;
                                    setTimeout(function () {
                                        scope.$apply(function () {
                                            scope.validRule = false;
                                        });
                                    }, 4000);
                                } else {
                                    scope.invalidRule = true;
                                    setTimeout(function () {
                                        scope.$apply(function () {
                                            scope.invalidRule = false;
                                        });
                                    }, 4000);
                                }
                            });
                        };
                        // Update Rule

                        scope.creatingRule = false;
                        scope.updatedTestCaseDetails = function (ev, editdata) {
                            scope.creatingRule = true;
                            var editCaseCode = editor.getSession().getValue();

                            var defination = escapeRulecode(editCaseCode, editdata.caseName);
debugger;
                            var caseData = {
                                "name": editdata.caseName,
                                "description": editdata.caseDescription,
                                "rule_type": "string",
                                "error_type": editdata.caseType,
                                "tags": "string",
                                "definition": defination,
                                "permissions": editdata.publishSettings
                            };
                            var ruleId = localStorage.getItem('ruleId');

                            $http({
                                method: 'PUT',
                                url: 'https://veegam.azure-api.net/re/rule/' + ruleId,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                                    'Authorization': localStorage.getItem("id_token")
                                },
                                data: caseData
                            }).then(function (response) {

                                var pipelineAssets;
                                var currentTestsCatObject;
                                /* 
                                pipelineAssets[0] = tenantID
                                pipelineAssets[1] = userID
                                pipelineAssets[2] = pipelineID
                                pipelineAssets[3] = StageID
                                */
                                findCatObject(catId, cats);

                                function findCatObject(id, cats) {
                                    for (var i = 0; i < cats.length; i++)
                                        angular.forEach(cats, function (el) {
                                            if (el.categoryID === id) {
                                                currentTestsCatObject = el;
                                                pipelineAssets = el.tenantIDuserIDpipelineIDStageID.split(":");
                                                updateTestData();
                                            }
                                        });
                                }

                                function updateTestData() {
                                    var type = "checkboxes";
                                    scope.currentTestsCatObject = currentTestsCatObject;
                                    findRulesListObject(type);

                                    function findRulesListObject(id) {
                                        var found = scope.currentTestsCatObject.categoryForm.some(function (el) {
                                            if (el.type === id) {
                                                scope.currentRuleObject = el;
                                            }
                                        });
                                    }
                                    Array.prototype.contains = function (element) {
                                        return this.indexOf(element) > -1;
                                    };

                                    var ruleObj = {
                                        "value": response.data,
                                        "name": response.config.data.name + '<span class="ruleId">' + response.data + '</span>'
                                    };
                                    for (var t = 0; t < scope.currentRuleObject.titleMap.length; t++) {
                                        if (scope.currentRuleObject.titleMap[t].value === ruleObj.value) {

                                            scope.currentRuleObject.titleMap[t] = ruleObj;
                                        }
                                    }

                                    for (var u = 0; u < scope.currentRuleObject.titleMap.length; u++) {
                                        if (scope.currentTestsCatObject.categorySchema.properties.testCases.default[u].value === ruleObj.value) {

                                            scope.currentTestsCatObject.categorySchema.properties.testCases.default[u] = ruleObj;
                                        }
                                    }

                                    for (var v = 0; v < scope.currentRuleObject.titleMap.length; v++) {
                                        if (scope.currentTestsCatObject.categorySchema.properties.testCases.items.enum[v].value === ruleObj.value) {

                                            scope.currentTestsCatObject.categorySchema.properties.testCases.items.enum[v] = ruleObj;
                                        }
                                    }

                                    $http({
                                        method: 'PUT',
                                        url: 'https://veegam.azure-api.net/veegam/pipelines/' + pipelineAssets[2] + '/stages/' + pipelineAssets[3] + '/category/' + currentTestsCatObject.categoryID + '',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Ocp-Apim-Subscription-Key': '2db7c591acc84ebfa0e7756ee1ded67b',
                                            'Authorization': localStorage.getItem("id_token")
                                        },
                                        data: scope.currentTestsCatObject
                                    }).then(function (response) {
                                        $http({
                                            method: 'GET',
                                            url: 'https://qh18lkpo0a.execute-api.us-west-2.amazonaws.com/dev/pipelines/' + pipelineAssets[2] + '/stages/' + pipelineAssets[3] + '/category/',
                                            headers: headers
                                        }).then(function (response) {
                                            scope.cats = response.data.body.Items;
                                            scope.form = angular.copy(scope.currentTestsCatObject);
                                            // scope.$broadcast('schemaFormRedraw');
                                            // scope.$apply();

                                            //  setTab(currentTabId);
                                        });
                                    });

                                }

                                scope.showSimpleToast();
                            });
                            $mdDialog.hide();
                            scope.showSimpleToast = function () {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent('Test Case is successfully Updated!')
                                    .position('top center')
                                    .hideDelay(3000)
                                );
                                scope.creatingRule = false;
                            };
                        };
                    }
                });
            },
            controller: 'utruleEditDirectivectrl'
        };

    }).controller("utruleEditDirectivectrl", ['$scope', '$mdDialog', '$http', '$timeout', function ($scope, $mdDialog, $http, $timeout) {
        var vm = this;
        $scope.utEditDialog = false;
        $scope.showDialog = showDialog;
        $scope.uteditoptions = {};

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
                        value: '\t\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\tScenario: Key has\/not a specific value.\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen https:\/\/schema.management.azure.com\/schemas\/2015-01-01\/deploymentTemplate.json# yes be its value\r\n\r\n\t\tWhen contentVersion is the key on template file\r\n\t\tThen 1.0.0.0 yes be its value\r\n\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen testvalue no be its value\r\n\r\n\t\tWhen contentVersion is the key on template file\r\n\t\tThen 1.0.0.1 no be its value\r\n\t\t\r\n\r\n\t\tGiven I can parse \"\/azuredeploy.parameters.json\" json\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen 10.0.0.0\/16 yes be its value\r\n\r\n\t\tWhen parameters.subnet1Prefix.value is the key on params file\r\n\t\tThen 10.0.1.0\/24 yes be its value\r\n\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen testvalue no be its value\r\n\r\n\t\tWhen parameters.subnet1Prefix.value is the key on params file\r\n\t\tThen testUser no be its value'
                    },
                    {
                        id: 9,
                        name: 'Key contains a value',
                        value: '\t\tBackground:\r\n\t\tGiven I can parse \"\/arm_dist/azuredeploy.json\" json\r\n\tScenario: Key contains a value.\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen value yes contain 2015-01-01\/deploymentTemplate.json\r\n\r\n\t\tWhen $schema is the key on template file\r\n\t\tThen value no contain test\r\n\t\t\r\n\r\n\t\tGiven I can parse \"\/parameters.json\" json\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen value yes contain 0\/16\r\n\r\n\t\tWhen parameters.vnetAddressPrefix.value is the key on params file\r\n\t\tThen value no contain 0\/18'
                    }
                ];

            }, 650);
        };
        $scope.selectedDefaultRule = function () {
            var j = $scope.rule;
            $scope.aceSession.setValue($scope.rule);
        };

        function showDialog($event) {
            $scope.utEditDialog = true;
            $scope.ruleEditLoading = true;
            var ruleId = localStorage.getItem('ruleId');
            var getCatData = $http({
                method: 'GET',
                url: 'https://veegam.azure-api.net/re/rule/' + ruleId,
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': 'e8096873a84e45a9b9fc8e8b733554d6',
                    'Authorization': localStorage.getItem("id_token")
                },
            }).then(function (response) {
                $scope.ruleEditLoading = false;
                localStorage.removeItem("editRuleData");
                localStorage.setItem("editRuleData", JSON.stringify(response.data.versions[0]));
                var editdata = JSON.parse(localStorage.getItem("editRuleData"));




                $mdDialog.show({
                    contentElement: '#utRuleEditCalled',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    controller: DialogController
                });
                var element = $event.currentTarget;
                var getCatId = jq(element).closest("v-pane-content").attr('id');
                setTimeout(function () {

                    $scope.uteditoptions.directiveFunc(editdata, $scope.cats, $scope.catId);
                }, 100);

                function DialogController($scope, $mdDialog) {


                    scope.closeDialog = function () {
                        scope.cat.categoryDescription = '';
                        $mdDialog.hide();
                    };
                }
            });
        }
    }]);