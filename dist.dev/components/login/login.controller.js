(function() {
    'use strict';

    angular
        .module('zoneapp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['authService', '$scope', '$window'];

    function LoginController( zoneService,$scope, $window) {

        var vm = this;
     //   vm.authService = authService;

        //loader
      //  $scope.loginLoader = $window.sessionStorage.getItem("loginLoader");

     vm.mockData= {
        "email": "jack@test.com",
        "name": "jack",
        "password": "Jack@123",
        "app_metadata": {
          "ownership": "citizen",
          "Access_Reason": "string",
          "Access_Type": "string",
          "status": "pending",
          "phone_number": "9881246627",
          "username": "jack"
        },
        "user_metadata": {},
        "connection": "Username-Password-Authentication"
      }

      vm.userRegistration = function(data) {
        vm.showLoading = true, 
        zoneService.createUser(data).
        then(function(e) {
          
        })

    }
}

}());