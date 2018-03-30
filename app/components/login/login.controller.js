(function() {
    'use strict';

    angular
        .module('zoneapp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['authService', '$scope', '$window'];

    function LoginController(authService, zoneService,$scope, $window) {

        var vm = this;
        vm.authService = authService;

        //loader
      //  $scope.loginLoader = $window.sessionStorage.getItem("loginLoader");

      vm.userRegistration = function(data) {
        vm.showLoading = true, 
        zoneService.createUser(data).then(function(e) {
          
        })

    }
}

}());