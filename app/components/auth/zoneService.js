angular
	.module('zoneapp')
	.factory('zoneService', zoneService);


zoneService.$inject = ['$http'];
var host="http://127.0.0.1";
function zoneService($http) {
	var obj = {};
	
	return {

		createZone: function (city,data, cb) {
			debugger;
			var req = {
				method: 'POST',
				url: host+':9004/v2/components/zones-service/city/'+city+'/zones',
				data: data,
				headers: {
					"content-type": "application/json",
					'user_access':"true",
					"Authorization":"Bearer "+localStorage.getItem('id_token')
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
				url: host+':9004/v2/components/zones-service/city/'+city+'/zones',
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
		getOwnersZones: function (cb) {


			$http({
				method: 'get',
				url: host+':9004/v2/components/zones-service/zones/owners',
				headers: {
					//'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true",
					"Authorization":"Bearer "+localStorage.getItem('id_token')
				}
			}).then(function (response) {
				var data = response
				return cb(data);
			});
		},
		getZone: function (city, zoneId, cb) {
			$http({
				method: 'GET',
				url: host+':9004/v2/components/zones-service/city/'+city+'/zones/'+zoneId,
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
		},
		

		createTrainer: function (zoneId,data, cb) {
			debugger;
			var req = {
				method: 'POST',
				url: host+':9005/v2/components/trainer-service/zone/'+zoneId+'/trainers',
				data: data,
				headers: {
					"Authorization":"Bearer "+localStorage.getItem('id_token'),
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
		getAllTrainers: function (cb) {


			$http({
				method: 'get',
				url: host+':9005/v2/components/trainer-service/zone/trainers',
				headers: {
					//'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true",
					"Authorization":"Bearer "+localStorage.getItem('id_token')
				}
			}).then(function (response) {
				var data = response
				return cb(data);
			});
		},
		getTrainer: function (trainerId, zoneId, cb) {
			$http({
				method: 'GET',
				url: host+':9005/v2/components/zones-service/',
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