(function() {

    'use strict';
	var zoneapp = angular.module('zoneapp', ['angular-jwt', 'ngRoute', 'ngMaterial', 'ngSanitize', 'vAccordion', 'schemaForm', 'ui.ace', 'pubnub.angular.service', 'naif.base64', 'ngMessages','auth0.auth0','ui.router','googlechart']);
	zoneapp.constant("moment", moment);
	zoneapp.config(config);
	
	config.$inject = ['$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'angularAuth0Provider'];

    function config($stateProvider,$locationProvider,$urlRouterProvider,angularAuth0Provider) {
	
		$urlRouterProvider.otherwise('/');

		$locationProvider.hashPrefix('');
	
		/// Comment out the line below to run the app
		// without HTML5 mode (will use hashes in routes)
		$locationProvider.html5Mode(true);
      
		$stateProvider
		.state('login', {
			url: '/',
                controller: 'LoginController',
                templateUrl: 'components/login/login.html',
                controllerAs: 'vm'
            })
			.state('dashboard', {
				url: '/dashboard',
				controller: 'DashboardController',
				templateUrl: 'components/dashboard/dashboard.component.html',
				controllerAs: 'vm',
				
			})
			.state('newzone', {
				url: '/newzone',
				controller: 'newZoneController',
				templateUrl: 'components/newzone/newzone.component.html',
				controllerAs: 'vm',
				
			})
			.state('zoneplans', {
				url: '/zoneplans',
				controller: 'zonePlansController',
				templateUrl: 'components/zone-plans/zone-plans.component.html',
				controllerAs: 'vm',
				
			})
			.state('zonelisting', {
				url: '/zonelisting',
				controller: 'zoneListingController',
				templateUrl: 'components/zone-listing/zone-listing.component.html',
				controllerAs: 'vm',
			})
			.state('badges', {
				url: '/badges',
				controller: 'badgesController',
				templateUrl: 'components/badges/badges.component.html',
				controllerAs: 'vm',
				
			})
			.state('trainers', {
				url: '/trainers',
				controller: 'trainersController',
				templateUrl: 'components/trainers/trainers.component.html',
				controllerAs: 'vm',
				
			})
			.state('callback', {
				url: '/callback',
				controller: 'CallbackController',
				templateUrl: 'components/callback/callback.html',
				controllerAs: 'vm'
			  });

		
			angularAuth0Provider.init({
			clientID: AUTH0_CLIENT_ID,
			domain: AUTH0_DOMAIN,
			responseType: 'token id_token',
			audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
			redirectUri: AUTH0_CALLBACK_URL,
			scope: 'openid profile app_metadata'
		});
		

	}

})();