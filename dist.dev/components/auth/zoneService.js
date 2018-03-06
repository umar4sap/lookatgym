angular
	.module('zoneapp')
	.factory('zoneService', zoneService);


zoneService.$inject = ['$http'];

function zoneService($http) {
	var obj = {};
	
	return {

		createZone: function (city,data, cb) {
			debugger;
			var req = {
				method: 'POST',
				url: ' http://127.0.0.1:9004/v2/components/zones-service/city/'+city+'/zones',
				data: data,
				headers: {
					"content-type": "application/json",
					'user_access':"true"
				}
			};
			$http(req).then(function (data) {
				debugger;
				var res = data
				
			return cb(res);
			});
		},
		getZones: function (city,cb) {


			$http({
				method: 'get',
				url: ' http://127.0.0.1:9004/v2/components/zones-service/city/'+city+'/zones',
				headers: {
					//'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true"
				}
			}).then(function (response) {
				var data = response
				return cb(data);
			});
		},
		getZone: function (city, zoneId, cb) {
			$http({
				method: 'GET',
				url: 'http://127.0.0.1:9004/v2/components/zones-service/city/'+city+'/zones/'+zoneId,
				headers: {
					//'Authorization': 'Bearer ' + idToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true"
					
				}
			}).then(function (response) {
				var data = response;
				
				return cb(data);
			});
		}
		
	};
}