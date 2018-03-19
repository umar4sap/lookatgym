(function() {

    'use strict';
	var zoneapp = angular.module('zoneapp', ['angular-jwt', 'ngRoute', 'ngMaterial', 'ui.bootstrap','ngSanitize', 'vAccordion', 'schemaForm', 'ui.ace', 'pubnub.angular.service', 'naif.base64', 'ngMessages','auth0.auth0','ui.router','googlechart','flow']);
	zoneapp.constant("moment", moment);
	zoneapp.config(config);
	
	config.$inject = ['$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
    'angularAuth0Provider','flowFactoryProvider'];

    function config($stateProvider,$locationProvider,$urlRouterProvider,angularAuth0Provider,flowFactoryProvider) {
	
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
				templateUrl: 'components/dashboard/dashboard.component.mobo.html',
				controllerAs: 'vm',
				
			})
			.state('tileboard', {
				url: '/tileboard',
				views: {
                    "main": {
						templateUrl: 'components/home/home.html'
						

					}
				},
				parent: 'dashboard'
			})
			.state('newzone', {
				url: '/newzone',
				views: {
                    "main": {
						templateUrl: 'components/newzone/newzone.component.html',
						controller: 'newZoneController',
						controllerAs: 'vm'

					}
				},
				parent:"dashboard"
				
			})
			.state('newzonemobo', {
				url: '/newzonemobo',
				templateUrl: 'components/newzone/newzone.component.mobo.html',
						controller: 'newZoneController',
						controllerAs: 'vm'

				
				
				
			})

			.state('zoneplans', {
				url: '/zoneplans',
				views: {
                    "main": {
						controller: 'zonePlansController',
				         templateUrl: 'components/zone-plans/zone-plans.component.mobo.html',
				        controllerAs: 'vm',

					}
				},
				parent: 'dashboard'
				
			})
			.state('zonedetails', {
				url: '/zonedetails/:zoneId/:city',
				controller: 'zoneDetailsController',
				params:      {'zoneId':null,'city':null},
				templateUrl: 'components/zone-details/zone-details.component.html',
				controllerAs: 'vm',
				
			})
			.state('memberdetails', {
				url: '/memberdetails/:zoneId/:memberId',
				controller: 'memberDetailsController',
				params:      {'zoneId':null,'memberId':null},
				templateUrl: 'components/member-details/member-details.component.html',
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
				
				views: {
                    "main": {
						controller: 'badgesController',
				templateUrl: 'components/badges/badges.component.html',
				controllerAs: 'vm',

					}
				},
				parent: 'dashboard'
				
			})
			.state('trainers', {
				url: '/trainers',
				views: {
                    "main": {
				controller: 'trainersController',
				templateUrl: 'components/trainers/trainers.component.html',
				controllerAs: 'vm',

					}
				},
				parent: 'dashboard'
				
				
			})
			.state('members', {
				url: '/members',
				
				views: {
                    "main": {
				controller: 'membersController',
				templateUrl: 'components/members/members.component.html',
				controllerAs: 'vm',
					}
				},
				parent: 'dashboard'
				
				
				
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
		
		flowFactoryProvider.defaults = {
			target: '/upload',
			permanentErrors:[404, 500, 501]
		};
		// You can also set default events:
		flowFactoryProvider.on('catchAll', function (event) {
		  
		});
	}

})();