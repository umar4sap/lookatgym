(function() {
    'use strict';

    angular
        .module('zoneapp').controller('ToolbarController', ToolbarController)

    .directive('toolbar', function() {
        return {
            templateUrl: 'components/layout/toolbar/toolbar.tpl.html'
        };
    });
    ToolbarController.$inject = ['$scope', 'authService', '$location'];

    function ToolbarController($scope, authService, $location) {
        var vm = this;
        vm.authService = authService;

        $scope.go = function(path) {
            $location.path(path);
        };
        $scope.goFullscreen = toggleFullScreen;
        var userProfile = localStorage.getItem('userProfile');
        $scope.userProfile = JSON.parse(userProfile);

        function toggleFullScreen() {
            // Fullscreen
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
        }
    }

})();