angular.module('zoneapp')

.directive('ciSpinner', function($mdDialog) {

    return {
        restrict: 'AE',

        template: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
        link: function(scope, element, attrs) {}
    };

});