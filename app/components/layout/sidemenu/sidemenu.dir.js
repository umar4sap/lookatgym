(function() {
    'use strict';

    angular
        .module('zoneapp')
        .directive('sidemenu', menu);

    function menu() {
        return {
            templateUrl: 'components/layout/sidemenu/sidemenu.tpl.html',
            controller: menuController,
            controllerAs: 'menu'
        };
    }

    function menuController($scope) {


    }




})();