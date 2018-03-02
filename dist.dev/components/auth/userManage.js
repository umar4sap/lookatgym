angular
	.module('zoneapp')
	.factory('userManage', userManage);


userManage.$inject = ['$http'];

function userManage($http) {
	var obj = {};
	var auth0Details = "{\"client_id\":\"EKJEc2mAWxajbRhUqGhwxDxcHEJKr7ZP\",\"client_secret\":\"8Vj7fIwDCuUrXm8f6Euxs8XWd8k3DFb2VQtGsVmXqwtg-tjJN22ANug1Tx9dRPdr\",\"audience\":\"https://veegam.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}";
	return {

		getGithubAccessToken: function (user_id, cb) {
			var req = {
				method: 'POST',
				url: 'https://sysgaindev.auth0.com/oauth/token',
				data: auth0Details,
				headers: {
					"content-type": "application/json",
				}
			};
			$http(req).success(function (data) {
				var auth_token = data.access_token;
				$http({
					method: 'GET',
					url: 'https://sysgaindev.auth0.com/api/v2/users?' + userid,
					headers: {
						"content-type": "application/json",
						"Authorization": "Bearer" + ' ' + auth_token
					}
				}).success(function (data) {

					for (var key in data) {
						if (data[key].user_id == 'github|' + userid) {
							var acces = data[key].identities[0].access_token;
							return cb(acces);
						}
					}
				});
			});
		},
		getTenants: function (cb) {


			$http({
				method: 'get',
				url: 'https://2f78ot2cib.execute-api.us-west-2.amazonaws.com/dev/users/tenants',
				headers: {
					'Authorization': localStorage.getItem("id_token"),
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
				}
			}).then(function (response) {
				var userTenants = response.data.userData;
				return cb(userTenants);
			});
		},
		getUserProfile: function (idToken, userid, cb) {
			$http({
				method: 'GET',
				url: 'https://veegam.azure-api.net/manageuser/user/' + userid,
				headers: {
					'Authorization': 'Bearer ' + idToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'Ocp-Apim-Subscription-Key':'3cd3411cfb154182a3267d34c5f86eb9'
				}
			}).then(function (response) {
				var userProfile = response.data;
				localStorage.setItem("userProfile", JSON.stringify(userProfile));
				return cb(userProfile.logins_count, userProfile);
			});
		},
		addUserBasicRole: function (idToken, userid, cb) {
			$http({
				method: 'POST',
				url: 'https://veegam.azure-api.net/manageuser/user/' + userid,
				headers: {
					'Authorization': 'Bearer ' + idToken,
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*",
					'Ocp-Apim-Subscription-Key':'3cd3411cfb154182a3267d34c5f86eb9'
				},
				data: {}
			}).then(function (response) {
				return cb("added basic info");
			});
		}
	};
}