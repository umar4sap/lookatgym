angular
	.module('zoneapp')
	.factory('zoneService', zoneService);


zoneService.$inject = ['$http'];
var host="http://159.65.15.180";
var localhost="http://localhost"
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

		createPlan: function (zoneId,data, cb) {
			debugger;
			var req = {
				method: 'POST',
				url: host+':9006/v2/components/plan-service/zone/'+zoneId+'/plans',
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
		getAllPlans: function (cb) {


			$http({
				method: 'get',
				url: host+':9006/v2/components/plan-service/zone/plans',
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
		getPlansForZone: function ( zoneId, cb) {
			$http({
				method: 'GET',
				url: host+':9006/v2/components/plan-service/zone/'+zoneId+'/plans',
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

		getPlanById: function ( planData, cb) {
			$http({
				method: 'GET',
				url: localhost+':9006/v2/components/plan-service/zone/'+planData.zoneId+'/plans/'+planData.planId,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true"
					
				}
			}).then(function (response) {
				var data = response;
				
				return cb(data);
			});
		},
		

		updatePlanById: function ( planData, data,cb) {
			debugger;
			$http({
				method: 'PUT',
				url: localhost+':9006/v2/components/plan-service/zone/'+planData.zoneId+'/plans/'+planData.planId,
				headers: {
					'Authorization': 'Bearer ' + idToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'user_access':"true",
					data:data
					
				}
			}).then(function (response) {
				var data = response;
				
				return cb(data);
			});
		},
		getTrainersForZone: function ( zoneId, cb) {
			$http({
				method: 'GET',
				url: host+':9005/v2/components/trainer-service/zone/'+zoneId+'/trainers',
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