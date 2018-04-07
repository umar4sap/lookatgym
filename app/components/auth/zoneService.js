angular
	.module('zoneapp')
	.factory('zoneService', zoneService);


zoneService.$inject = ['$http'];
var host= "http://159.65.15.180";
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
				method: 'GET',
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
				method: 'GET',
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
				method: 'GET',
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
				method: 'GET',
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
		getAllMembers: function (status,cb) {
			$http({
				method: 'GET',
				url: host+':9004/v2/components/zones-service/zones/members/status/'+status,
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

		getAllMembersForZone: function (zoneId,status,cb) {
			$http({
				method: 'GET',
				url: host+':9004/v2/components/zones-service/zones/'+zoneId+'/members/status/'+status,
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
				url: host+':9006/v2/components/plan-service/zone/'+planData.zoneId+'/plans/'+planData.planId,
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
		getTrainerById: function ( trainerData, cb) {
			debugger;
			$http({
				method: 'GET',
				url: host+':9005/v2/components/trainer-service/zone/'+trainerData.zoneId+'/trainers/'+trainerData.trainerId,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
					
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
				url: host+':9006/v2/components/plan-service/zone/'+planData.zoneId+'/plans/'+planData.planId,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
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
		},
		createUser: function ( data, cb) {
			$http({
				method: 'POST',
				url: localhost+':9009/v2/components/newuser-service/user',
				headers: {
					//'Authorization': 'Bearer ' + idToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				},
				data: data
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		}
		,
		createBranch: function ( ownershipId,data, cb) {
			$http({
				method: 'POST',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				},
				data: data
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		},
		getBranches: function ( ownershipId, cb) {
			$http({
				method: 'GET',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				}
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		},
		getBranchDetails: function ( ownershipId,branchId, cb) {
			$http({
				method: 'GET',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/'+branchId+'/details',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				}
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		}
		,
		addManagerToBranch: function ( ownershipId,branchId,memberEmail, cb) {
			$http({
				method: 'POST',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/'+branchId+'/members/'+memberEmail,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				},
				data:{}
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		},
		deleteManagerFromBranch: function ( ownershipId,branchId,memberEmail, cb) {
			$http({
				method: 'DELETE',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/'+branchId+'/members/'+memberEmail,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				}
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		}
		,
		deleteBranch: function ( ownershipId,branchId, cb) {
			$http({
				method: 'DELETE',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/'+branchId,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				},
				data: data
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		},
		AddPermissionsToBranch: function ( ownershipId,branchId,data, cb) {
			$http({
				method: 'PUT',
				url: localhost+':9008/v2/components/branch-management-service/ownerships/'+ownershipId+'/branchs/'+branchId+'/roles',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					//'user_access':"true"
					
				},
				data: data
			}).then(function mySuccess(response) {
				data = response;
				return cb(null,data)
			  }, function myError(response) {
				err = response;
				return cb(err,null)
			});
		}
		
	};
}