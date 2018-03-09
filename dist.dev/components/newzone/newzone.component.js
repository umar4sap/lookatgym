    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('newZoneController', newZoneController);

        newZoneController.$inject = ['$scope', '$state', 'authService', '$mdDialog','$location', '$http', '$q', '$mdToast', 'moment', '$filter','zoneService'];

        function newZoneController($scope, $state, authService, $mdDialog,$location, $http, $q, $mdToast, moment, $filter,zoneService) {
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
    $scope.pricing=false;
    
    }else if(data=="zone_setting"){
        $scope.zone_basics=false;
        $scope.zone_setting=true;
        $scope.zone_upload=false;
        $scope.pricing=false;
      
    }else if(data=="zone_upload"){
        $scope.zone_upload=true;
        $scope.zone_basics=false;
        $scope.zone_setting=false;
        $scope.pricing=false;
       
        
    }else if(data=="pricing"){
        $scope.zone_upload=false;
        $scope.zone_basics=false;
        $scope.zone_setting=false;
        $scope.pricing=true;
       
        
    }
}

vm.live=function(data){
    $scope.inprogress=true;
    $scope.mockData.zoneName=data.zoneName;
    $scope.mockData.aboutZone=data.aboutZone;
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
   
    $scope.showAlert = function(ev,msg) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Zone Creation')
            .textContent(msg)
            .ariaLabel('Alert Dialog Demo')
            .ok('okay!')
            .targetEvent(ev)
        );
      };
   zoneService.createZone(data.city,$scope.mockData,function(response){

    
    if(response.data.status==200){
        $scope.inprogress=false;
        $scope.showAlert(null,response.data.data.message);
        $state.go("dashboard");
        
    }else{
        $scope.showAlert(null,"error while creating Zone");
        $scope.inprogress=false;
        $state.go("newzone");
    }

     
      


});

}
        }
    }());