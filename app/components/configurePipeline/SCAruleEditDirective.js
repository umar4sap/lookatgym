angular.module('zoneapp')

.directive('scaruleViewDirective', function($http) {

        return {
            templateUrl: 'components/configurePipeline/scaruleViewDirective.html',
            restrict: 'E',
            replace: true,
            scope: { options: '=' },
            link: function(scope, element) {

                scope.scaruleViewDirectiveShow = false;
                angular.extend(scope.options, {
                    directiveFunction: function(we) {
                        var defination = (we.data.versions[0].definition).replace(/\\n/g, "\n");
                        scope.scaruleViewDirectiveShow = true;
                        var editor = ace.edit("scaruleViewDirective");
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
            controller: 'fsruleEditDirectivectrl'
        };

    })
    .directive('scaruleEditDirective', function($mdDialog, $http, $mdToast) {

        return {
            templateUrl: 'components/configurePipeline/SCAruleEditDirectiveTemplate.html',
            restrict: 'E',
            replace: true,
            scope: { options: '=' },
            link: function(scope) {
                scope.scaruleViewDirectiveShow = false;
                angular.extend(scope.options, {
                    directiveFunc: function(we) {
                        var defination = (we.data.versions[0].definition).replace(/\\n/g, "\n");
                        scope.scaruleViewDirectiveShow = true;
                        var editor = ace.edit("scaruleEditDirective");
                        editor.setTheme("ace/theme/monokai");
                        editor.getSession().setMode("ace/mode/javascript");
                        editor.getSession().setTabSize(4);
                        editor.getSession().setUseWrapMode(true);
                        editor.setFontSize("13px");
                        editor.resize();
                        editor.getSession().setUseWorker(false);
                        editor.session.setValue(defination);
                        editor.getSession().on('change', function(e) {
                            scope.validated = false;
                        });
                        editor.getSession().selection.on('changeCursor', function(e) {
                            scope.validated = false;
                        });
                        editor.getSession().selection.on('changeSelection', function(e) {
                            scope.validated = false;
                        });

                        scope.caseName = we.data.versions[0].name;
                        scope.caseDescription = we.data.versions[0].description;
                        scope.publishSettings = we.data.versions[0].permissions;
                        scope.caseType = we.data.versions[0].error_type;

                        //close Dialog
                        scope.closeDialog = function() {
                            $mdDialog.hide();
                            localStorage.removeItem('ruleId');
                        };


                        // get editor case code
                        function ruleDefinationMethod() {
                            function escape(key, val) {
                                if (typeof(val) != "string") return val;
                                return val
                                    .replace(/[\r]/g, '');
                            }
                            var getUpdatedCode = editor.getSession().getValue();
                            ruleDefination = JSON.stringify(getUpdatedCode, escape, 4).replace(/^"(.*)"$/, '$1');
                            return ruleDefination;
                        }
                        // vaidate rule
                        scope.updatedTestCaseValidate = function(caseCode) {
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
                                    "definition": ruleDefinationMethod()
                                }
                            }).then(function(response) {

                                scope.validationInProgress = false;

                                if (response.data === "valid") {
                                    scope.validated = true;
                                } else {
                                    scope.invalidRule = true;
                                }
                            });
                        };
                        // Update Rule
                        scope.updatedTestCaseDetails = function(ev, caseName, caseDescription, publishSettings, caseType) {
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
                            }).then(function(response) {
                                scope.showSimpleToast();
                            });
                            $mdDialog.hide();
                            scope.showSimpleToast = function() {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent('Successfully Updated!')
                                    .position('bottom right')
                                    .hideDelay(3000)
                                );
                            };
                        };
                    }
                });
            },
            controller: 'fsruleEditDirectivectrl'
        };

    }).controller("fsruleEditDirectivectrl", ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {
        var vm = this;
        $scope.scaEditDialog = false;
        $scope.scaRuleEdit = scaRuleEdit;
        $scope.scaEditOptions = {};

        function scaRuleEdit($event) {
            $scope.scaEditDialog = true;
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
            }).then(function(response) {
                $scope.ruleEditLoading = false;
                $mdDialog.show({
                    contentElement: '#scaRuleEditCalled',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    controller: DialogController
                });
                $scope.scaEditOptions.directiveFunc(response);

                function DialogController($scope, $mdDialog) {
                    scope.closeDialog = function() {
                        $mdDialog.hide();
                        localStorage.removeItem('ruleId');
                    };
                }
            });
        }
    }]);