angular.module('zoneapp')

    .directive('ruleViewDirective', function ($http) {

        return {
            templateUrl: 'components/configurePipeline/ruleViewDirective.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: '='
            },
            link: function (scope, element) {

                scope.directiveCtrlCalled = false;
                angular.extend(scope.options, {
                    directiveFunction: function (we) {
                        var rawDefination = (we.data.versions[0].definition).replace(/\\n/g, "\n");
                        var defination = rawDefination.replace(/\\t/g, '');
                        scope.directiveCtrlCalled = true;
                        var editor = ace.edit("ruleViewDirective");
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

                    }
                });
            },
            controller: 'ruleEditDirectivectrl'
        };

    }).directive('ruleEditDirective', function ($mdDialog, $http, $mdToast) {

        return {
            templateUrl: 'components/configurePipeline/ruleEditDirectiveTemplate.html',
            restrict: 'E',
            replace: true,
            scope: {
                options: '='
            },
            link: function (scope) {
                scope.directiveCtrlCalled = false;
                angular.extend(scope.options, {
                    directiveFunc: function (we) {

                        var rawDefination = (we.definition).replace(/\\n/g, "\n");
                        var defination = rawDefination.replace(/\\t/g, '');
                        scope.directiveCtrlCalled = true;
                        var editor = ace.edit("ruleEditDirectiveEditor");
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
                        scope.fsEditData = {
                            "caseName": we.name,
                            "caseDescription": we.description,
                            "publishSettings": we.permissions,
                            "caseType": we.error_type
                        };

                        // scope.editdata.caseName = we.data.versions[0].name;
                        // scope.editdata.caseDescription = we.data.versions[0].description;
                        // scope.editdata.publishSettings = we.data.versions[0].permissions;
                        // scope.editdata.caseType = we.data.versions[0].error_type;

                        //close Dialog
                        scope.closeDialog = function () {
                            $mdDialog.hide();
                            // localStorage.removeItem('ruleId');
                        };



                        // // get editor case code
                        // function ruleDefinationMethod() {
                        //     function escape(key, val) {
                        //         if (typeof(val) != "string") return val;
                        //         return val
                        //             .replace(/[\r]/g, '');
                        //     }
                        //     var getUpdatedCode = editor.getSession().getValue();
                        //     ruleDefination = JSON.stringify(getUpdatedCode, escape, 4).replace(/^"(.*)"$/, '$1');
                        //     return ruleDefination;
                        // }
                        // // vaidate rule

                        scope.updatedTestCaseValidate = function (testData) {

                            String.prototype.splice = function (idx, rem, str) {
                                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                            };

                            var removeLine = testData.caseCode.replace(/\n/g, "");
                            var editorData = JSON.stringify(removeLine).replace(/^"(.*)"$/, '$1');
                            var h = JSON.stringify(editorData).replace(/\\r/g, '');
                            var rawString, featureData, Datascenario;
                            if (editorData.indexOf('Scenario:') >= 0) {
                                var indexScenario = editorData.indexOf('Scenario:');
                                //add \n\t\t to Given
                                rawString = editorData.splice(indexScenario, 0, "\\n\\t");

                            }
                            if (editorData.indexOf('Given') >= 0) {
                                var indexGiven = editorData.indexOf('Given');
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

                            var ruleDefinationConcat = "Feature: " + testData.caseName + rawString;
                            var ruleDefination = ruleDefinationConcat.replace(/\\r/g, '');
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
                                    "definition": ruleDefination
                                }
                            }).then(function (response) {

                                scope.validationInProgress = false;

                                if (response.data === "valid") {
                                    scope.validated = true;
                                } else {
                                    scope.invalidRule = true;
                                }
                            });
                        };
                        // Update Rule
                        scope.updatedTestCaseDetails = function (ev, caseName, caseDescription, publishSettings, caseType) {
                            var caseData = {
                                "name": caseName,
                                "description": caseDescription,
                                "rule_type": "string",
                                "error_type": caseType,
                                "tags": "string",
                                "definition": ruleDefinationMethod(),
                                "permissions": publishSettings
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
                            };
                        };
                    }
                });
            }
        };

    }).controller("ruleEditDirectivectrl", ['$scope', '$mdDialog', '$http', function ($scope, $mdDialog, $http) {
        var vm = this;
        $scope.fsEditDialog = false;
        $scope.showDialog = showDialog;
        $scope.editOptions = {};
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
            $scope.fsEditDialog = true;
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
                // var editdata = response.data.versions[0];
                localStorage.removeItem("editRuleData");
                localStorage.setItem("editRuleData", JSON.stringify(response.data.versions[0]));

                var editdata = JSON.parse(localStorage.getItem("editRuleData"));

                $mdDialog.show({
                    contentElement: '#ruleEditCalled',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    controller: DialogController
                });
                $scope.editOptions.directiveFunc(editdata);

                function DialogController($scope, $mdDialog) {
                    $scope.directiveCtrlCalled = true;
                    scope.closeDialog = function () {
                        $mdDialog.hide();
                        // localStorage.removeItem('ruleId');
                    };
                }
            });
            // localStorage.removeItem('ruleId');
        }
    }]);