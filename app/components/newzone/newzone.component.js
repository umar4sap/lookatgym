    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('newZoneController', newZoneController);

        newZoneController.$inject = ['$scope', '$state', 'authService', '$location', '$http', '$q', '$mdToast', 'moment', '$filter','zoneService'];

        function newZoneController($scope, $state, authService, $location, $http, $q, $mdToast, moment, $filter,zoneService) {
            var vm = this;
            var userProfile = localStorage.getItem('profile');
    $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.go = function (path) {
                $location.path(path);
   
            };

            $scope.mockData={
                "zoneName": "f1 fitness",
                "zoneOwnerName": "lala",
                "zoneAddress": "lala@umar.com" ,
                "Country":  "india",
                "zoneType": "Fitness club",
                "zoneSince":"2001",
                "zoneEmail":"umar@test.com",
                "zoneMemberActivateMessage":"Thanks for subscription",
                "zoneMemberDeactivateMessage":"zoneMemberDeactivateMessage",
                "zonefreeTrailPerMonth": 80,
                "zoneTiming": {
                 "morning":"",
                 "evening":""
                },
                "zoneSubcriptionDetails": "silver" ,
                "zoneTrainers":  [],
                "zoneMemberPlanExpireMessage":"onLabShare",
                "zonefreeTrailPerDay": 4,
                "images":[{"imgId":"","url":"","title":""}],
                "videos":[{"vidId":"","url":"","title":""}],
                 "zoneCoverImage":[{"imgId":"","url":"","title":""}],
                 "logo":[{"imgId":"","url":"","title":""}],
                 "zoneFor":[],
                 "zoneCurrentDiscounts":  [],
                 "zoneCurrentPlans":  [],
                 "primaryContact":"7507848446",
                 "aboutZone":"aboutZone",
                 "zoneShortDescription":"zoneShortDescription"     
              };

vm.section=function(data){
    debugger;
    if(data=="zone_basics"){
        
    $scope.zone_basics=true;
    $scope.zone_setting=false;
    $scope.zone_upload=false;
    
    }else if(data=="zone_setting"){
        $scope.zone_basics=false;
        $scope.zone_setting=true;
        $scope.zone_upload=false;
      
    }else if(data=="zone_upload"){
        $scope.zone_upload=true;
        $scope.zone_basics=false;
        $scope.zone_setting=false;
       
        
    }
}

vm.live=function(data){
    $scope.inprogress=true;
    $scope.mockData.zoneName=data.zoneName;
    $scope.mockData.zoneOwnerName=data.zoneOwnerName;
    $scope.mockData.zoneAddress=data.zoneAddress;
    $scope.mockData.Country=data.Country;
    $scope.mockData.zoneSince=data.zoneSince;
    $scope.mockData.zoneTiming={
        "morning":data.morningTime,
        "evening":data.eveningTime
       }
    $scope.mockData.zoneEmail=data.zoneEmail;
    $scope.mockData.zoneMemberActivateMessage=data.zoneMemberActivateMessage;
    $scope.mockData.zoneMemberDeactivateMessage=data.zoneMemberDeactivateMessage;
    $scope.mockData.primaryContact=data.primaryContact;
    $scope.mockData.zoneShortDescription=data.zoneShortDescription;
    $scope.mockData.zonefreeTrailPerMonth=Number(data.zonefreeTrailPerMonth);
    $scope.mockData.zonefreeTrailPerDay=Number(data.zonefreeTrailPerDay);
    $scope.mockData.zoneMemberPlanExpireMessage=data.zoneMemberPlanExpireMessage;
    $scope.mockData.zoneTrainers=[data.zoneTrainers];
    $scope.mockData.zoneCurrentPlans=[data.zoneCurrentPlans];
    $scope.mockData.zoneCurrentDiscounts=[data.zoneCurrentDiscounts];
    $scope.mockData.zoneFor=[data.zoneFor];
    $scope.mockData.zoneSubcriptionDetails=[data.zoneSubcriptionDetails || "silver"];
   
   zoneService.createZone(data.city,$scope.mockData,function(response){

    var message=response.data.data.message;
    $scope.inprogress=false;
    $scope.showSimpleToast = function() {
       // var pinTo = $scope.getToastPosition();
    
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .position( {
                bottom: false,
                top: true,
                left: false,
                right: true
              } )
            .hideDelay(3000)
        );
      };
      setTimeout(function(){ $state.go("dashboard");},2000)
     


});

}
        }
    }());