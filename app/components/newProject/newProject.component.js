(function () {

    'use strict';

    angular
        .module('zoneapp')
        .controller('newProjectController', newProjectController);

    newProjectController.$inject = ['$scope', '$rootScope', 'authService', '$location', '$http', '$mdToast', 'userManage', '$q', '$timeout'];

    function newProjectController($scope, $rootScope, authService, $location, $http, $mdToast, userManage, $q, $timeout) {
        var vm = this;
        vm.authService = authService;

        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.repoTypes = [{
            "name": "Public",
            "value": "public"
        }, {
            "name": "Private",
            "value": "private"
        }];
        //Git API 

        var id_token = localStorage.getItem("id_token");

        $scope.userProfileData = JSON.parse(localStorage.getItem("userProfile"));
        $scope.step1Layout = true;
        $scope.step1 = function (stepData) {
            getGitusers(stepData.gitAccount);
        };
        $scope.addProjectCancel = function () {
            $scope.step1Layout = true;
            $scope.addProject = {};
        };
        $scope.gitNotFound = false;

        function getGitusers(user) {
            $http({
                method: 'GET',
                url: 'https://api.github.com/users/' + user + '?access_token=' + $scope.userProfileData.identities[0].access_token + '',

            }).then(function (response) {
                $scope.gitAccounts = response;
                next(user, response.data);
            }).catch(function (data) {
                $scope.gitNotFound = true;
            });

        }

        $scope.changeGitAccount = function () {
            $scope.step1Layout = true;
        };

        $scope.repoTypeChange = function () {
            // vm.repo = null;
            // $scope.selectedRepo = null;
            // vm.repos = [];
            // vm.selectedRepo = null;
            $scope.githubRepoName = {};
            $scope.ifSubfolder = false;
            vm.searchRepo = null;
            // vm.searchRepo = searchRepo;
        };



        function next(step1Data, userData) {
            $scope.projectName = step1Data.projectName;
            $scope.userData = userData;
            $scope.step1Layout = false;
            var reposUrl;
            $scope.hasOrgs = false;
            if (userData.login === $scope.userProfileData.nickname) {
                $scope.hasOrgs = true;
                $http({
                        method: 'GET',
                        url: 'https://api.github.com/user/orgs?access_token=' + $scope.userProfileData.identities[0].access_token,
                    })
                    .then(function (response) {
                        
                        //adding git account to orgs list
                        response.data.splice(0, 0, {
                            "login": userData.login
                        });
                        $scope.orgs = response.data;
                    });
            }



            if ($scope.hasOrgs) {
                $scope.orgSelected = function () {
                    $scope.userOrgSelected = true;
                    if ($scope.userOrgSelected && $scope.organizations !== userData.login) {
                        $scope.repoType = null;
                        reposUrl = "https://api.github.com/orgs/" + $scope.organizations + "/repos?type=all&page=1&per_page=100&access_token=" + $scope.userProfileData.identities[0].access_token;
                        loadReposBranches(reposUrl);
                    } else {
                        $scope.repoType = null;
                        if (userData.login === $scope.userProfileData.nickname) {
                            reposUrl = 'https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&page=1&per_page=100&access_token=' + $scope.userProfileData.identities[0].access_token;
                        } else {
                            reposUrl = 'https://api.github.com/users/' + userData.login + '/repos?type=all&page=1&per_page=100&access_token=' + $scope.userProfileData.identities[0].access_token;
                        }
                        loadReposBranches(reposUrl);
                    }
                };
            } else {
                $scope.repoType = null;
                if (userData.login === $scope.userProfileData.nickname) {
                    reposUrl = 'https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&page=1&per_page=100&access_token=' + $scope.userProfileData.identities[0].access_token;
                } else {
                    reposUrl = 'https://api.github.com/users/' + userData.login + '/repos?type=all&page=1&per_page=100&access_token=' + $scope.userProfileData.identities[0].access_token;
                }
                loadReposBranches(reposUrl);
            }

            function loadReposBranches(reposUrl) {
                $http({
                        method: 'GET',
                        url: reposUrl,
                    })
                    .then(function (response) {
                        $scope.reposList = response.data;

                        reposListAutocomplete(response);

                        function reposListAutocomplete(response) {
                            $scope.allGitRepos = [];
                            response.data.forEach(function (element) {
                                var obj = {
                                    "repoName": element.name,
                                    "repotype": element.private
                                };

                                $scope.allGitRepos.push(obj);
                            }, this);

                            var allGitRepos = '';
                            for (var i = 0; i < $scope.allGitRepos.length; i++) {
                                allGitRepos += "" + $scope.allGitRepos[i] + ", ";
                            }
                            vm.selectedRepo = null;
                            vm.searchRepo = null;
                            vm.simulateQuery = false;
                            vm.isDisabled = false;
                            vm.Repos = loadRepos();
                            vm.repoSearch = repoSearch;
                            vm.selectedRepo = selectedRepo;
                            vm.selectedRepoChange = selectedRepoChange;

                            vm.newState = newState;

                            function newState(state) {
                                alert("Sorry! You'll need to create a Constitution for " + state + " first!");
                            }
                            $scope.$watchCollection('repoType', function () {
                                vm.Repos = loadRepos();
                            });

                            function repoSearch(query) {
                                if ($scope.repoType !== undefined) {
                                    var tempArr = [];
                                    vm.Repos.forEach(function (element) {
                                        if ($scope.repoType === '' + element.repotype + '') {
                                            tempArr.push(element);
                                        }

                                    }, vm);
                                    vm.Repos = tempArr;
                                }
                                var results = query ? vm.Repos.filter(createRepoFilterFor(query)) : vm.Repos,
                                    deferred;
                                if (vm.simulateQuery) {
                                    deferred = $q.defer();
                                    $timeout(function () {
                                        deferred.resolve(results);
                                    }, Math.random() * 1000, false);
                                    return deferred.promise;
                                } else {
                                    return results;
                                }
                            }

                            function loadRepos() {
                                return $scope.allGitRepos.map(function (state) {
                                    return {
                                        value: state.repoName,
                                        display: state.repoName,
                                        repotype: state.repotype
                                    };
                                });
                            }

                            function selectedRepo(repo) {

                            }
                            //branches loding starts here
                            function selectedRepoChange(r) {
                                // response.data.forEach(function(element) {
                                //     if (element.name === repo.value) {
                                //         $scope.branchesUrl = element.branches_url;
                                //     }
                                // }, this);
                                $scope.githubRepoBranch = "";
                                getBranchesList(r.display);

                            }
                            //branches loding ends here

                            function createRepoFilterFor(query) {
                                var lowercaseQuery = angular.lowercase(query);
                                return function filterFn(state) {
                                    return (state.value.indexOf(lowercaseQuery) === 0);
                                };

                            }

                        }

                        function getBranchesList(r) {


                            function search(array, key, prop) {
                                // Optional, but fallback to key['name'] if not selected
                                prop = (typeof prop === 'undefined') ? 'name' : prop;

                                for (var i = 0; i < array.length; i++) {
                                    if (array[i][prop] === key) {
                                        return array[i];
                                    }
                                }
                            }

                            var repoObj = search($scope.reposList, r, 'name');
                            // var repoObj = $scope.reposList.find(x => x.full_name === r);

                            $scope.branchesUrl = 'https://api.github.com/repos/' + repoObj.full_name + '/branches?access_token=' + $scope.userProfileData.identities[0].access_token;


                            $http({
                                    method: 'GET',
                                    url: $scope.branchesUrl,
                                })
                                .then(function (response) {
                                    $scope.branchesList = '';
                                    response.data.forEach(function (element) {
                                        $scope.branchesList += "" + element.name + ", ";
                                    }, this);

                                    vm.searchBranch = null;
                                    vm.simulateQuery = false;
                                    vm.isDisabled = false;
                                    vm.Branches = loadBranches();
                                    vm.branchSearch = branchSearch;
                                    vm.selectedBranch = null;
                                    vm.selectedBranchChange = selectedBranchChange;

                                    vm.newBranch = newBranch;

                                    function newBranch(branch) {
                                        alert("Sorry! You'll need to create a Constitution for " + branch + " first!");
                                    }

                                    function branchSearch(query) {
                                        var results = query ? vm.Branches.filter(createBranchFilterFor(query)) : vm.Branches,
                                            deferred;
                                        if (vm.simulateQuery) {
                                            deferred = $q.defer();
                                            $timeout(function () {
                                                deferred.resolve(results);
                                            }, Math.random() * 1000, false);
                                            return deferred.promise;
                                        } else {
                                            return results;
                                        }
                                    }

                                    function loadBranches() {
                                        return $scope.branchesList.split(/, +/g).map(function (state) {
                                            return {
                                                value: state.toLowerCase(),
                                                display: state
                                            };
                                        });
                                    }

                                    function selectedBranch(branch) {

                                    }

                                    function selectedBranchChange(b) {}

                                    function createBranchFilterFor(query) {
                                        var lowercaseQuery = angular.lowercase(query);
                                        return function filterFn(state) {
                                            return (state.value.indexOf(lowercaseQuery) === 0);
                                        };

                                    }

                                });
                        }
                    });
            }
        }
        // });


        $scope.projectSubmit = false;

        $scope.addproject = function (projectName, githubAccountName, repoType, githubRepoName, githubRepoBranch, githubSubfolderName) {

            $scope.projectSubmit = true;
            if (projectName && githubAccountName && githubRepoName && githubRepoBranch) {
                var projectRequestData = {

                    "projectName": projectName,
                    "githubAccountName": githubAccountName.toLowerCase(),
                    "githubRepoName": githubRepoName.display,
                    "repoType": repoType,
                    "githubRepoBranch": githubRepoBranch.value,
                    "githubSubfolderName": githubSubfolderName

                };
                
                $http({
                    method: 'POST',
                    url: 'https://q8rkva5aq0.execute-api.us-west-2.amazonaws.com/dev/projects',
                    headers: {
                        'Authorization': localStorage.getItem("id_token"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*"
                    },
                    data: projectRequestData
                }).then(function (response) {
                    var content;
                    if (response.data.statusCode == 200) {
                        content = "Project is created successfully"
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(content)
                                .position('top center')
                                .hideDelay(3000)
                        );
    
    
                        $scope.go("/projects");
                    } else if (response.data.statusCode == 400) {
                        content = response.data.body
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(content)
                                .position('top center')
                                .hideDelay(3000)
                                .highlightClass('md-accent')
                        );
                    }
                    $scope.projectSubmit = false;
                    


                });

            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Error Occured, Please enter Project details')
                        .position('top right')
                        .hideDelay(3000)
                );
            }
        };
    }

}());