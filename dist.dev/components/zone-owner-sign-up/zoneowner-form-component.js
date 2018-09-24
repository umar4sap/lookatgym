(function () {
    'use strict';

    angular
        .module('zoneapp')
        .controller('zoneownerFormController', zoneownerFormController);

    zoneownerFormController.$inject = ['authService', 'zoneService', '$scope', '$window', '$state','$mdDialog'];

    function zoneownerFormController(authService, zoneService, $scope, $window, $state,$mdDialog) {

        var vm = this;
        vm.authService = authService;

        //loader
        //  $scope.loginLoader = $window.sessionStorage.getItem("loginLoader");


        $scope.showAlert = function(ev,msg) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Failed')
                .textContent(msg)
                .ariaLabel('Message')
                .ok('ok')
                .targetEvent(ev)
            );
          };
        vm.mockData = {
            "email": "jack@test.com",
            "name": "jack",
            "password": "Jack@123",
            "app_metadata": {
                "ownership": "citizen",
                "register_Type": "string",
                "status": "pending",
                "phone_number": "9881246627",
                "username": "jack",
                "permissions": {
                    "ownerships": []
                }
            },
            "user_metadata": {},
            "connection": "Username-Password-Authentication"
        }

        $scope.$watch('vm.signupData.confirmpassword', function (value) {
            
            if (vm.password == value) {
                vm.passwordError = false;
            } else {
                vm.passwordError = "password doesn't match";
            }
        });
        vm.userRegistration = function (data) {
            vm.inprogress = true;
            document.getElementById("overlay").style.display = "block";
            vm.mockData.email = data.email;
            vm.mockData.name = data.name;
            vm.mockData.password = data.confirmpassword;
            vm.mockData.app_metadata = data.app_metadata;
            vm.mockData.app_metadata.permissions = { "ownerships": [] }
            zoneService.createUser(vm.mockData, function (err, res) {
                if (!err) {
                    document.getElementById("overlay").style.display = "none";
                    vm.inprogress = false;
                    document.querySelector('.cont-sing-up').classList.toggle('s--signup');
                    vm.signupData = "";
                    
                } else {
                    vm.inprogress = false;
                    document.getElementById("overlay").style.display = "none";
                    $scope.showAlert(null,err.message)
                     signupData = "";
                }

            })
        }
        var webAuth = new auth0.WebAuth({
            domain: "zones.auth0.com",
            clientID: "cO02S01qm4vmAp2jhUtuLI4iAfQgXNx4",
            responseType: 'code',

            //audience:'https://dhruvnewgen.auth0.com/userinfo'
        });
        vm.getToken = function (data) {
            debugger;
            document.getElementById("overlay").style.display = "block";
            vm.inprogress = true;
            webAuth.client.login({
                realm: "Username-Password-Authentication",
                username: data.username,
                password: data.password,
                scope: "openid profile app_metadata email"
            }, function (err, authResult) {
                // Auth tokens in the result or an error
                if (err) {
                    console.log(err)
                    vm.inprogress = false;
                    debugger;
                    document.getElementById("overlay").style.display = "none";
                    $scope.showAlert(null,err.description)
                    
                }
                else {
                    var userDetails = authResult;
                    if (authResult.idToken) {
                        localStorage.setItem('id_token', authResult.idToken);
                        function parseJwt(token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse(window.atob(base64));
                        };
                        var tokenData = parseJwt(authResult.idToken)
                        localStorage.setItem('profile', JSON.stringify(tokenData));

                        vm.inprogress = false;
                        document.getElementById("overlay").style.display = "none";
                        $state.go('dashboard');
                    }
                    console.log("details" + userDetails)
                }
            });
        }






    }

}());