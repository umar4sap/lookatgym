angular.module('zoneapp')

.directive('sidenav', function() {

    return {
        restrict: 'AE',

        templateUrl: "/directives/sideNav/sidenav.template.html",
        link: function(scope, element, attrs) {}
    };

});