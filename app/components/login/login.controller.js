(function() {
    'use strict';

    angular
        .module('zoneapp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['authService', '$scope', '$window'];

    function LoginController(authService, $scope, $window) {

        var vm = this;
        vm.authService = authService;

        //loader
      //  $scope.loginLoader = $window.sessionStorage.getItem("loginLoader");

    }

}());