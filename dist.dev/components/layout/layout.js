(function() {

    'use strict';

    angular
        .module('zoneapp')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = ['authService'];

    function LayoutController(authService) {

        var vm = this;
        vm.authService = authService;
    }

}());