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
                "zoneMemberPlanExpireMessage":"onLabShare",
                "zonefreeTrailPerDay": 4,
                "images":[],
                "videos":{"vidId":"","url":"","title":""},
                 "zoneCoverImage":{"imgId":"","url":"","title":""},
                 "logo":{"imgId":"1","url":"","title":"logo"},
                 "zoneFor":[],
                 
                 "zoneCurrentFacilities":  [],
                 "primaryContact":"7507848446",
                 "aboutZone":"aboutZone",
                 "zoneShortDescription":"zoneShortDescription",
                 "openDays":{}
              };
 $scope.zone_basics=true;
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
$scope.mytime = new Date();

$scope.hstep = 1;
$scope.mstep = 15;

$scope.options = {
  hstep: [1, 2, 3],
  mstep: [1, 5, 10, 15, 25, 30]
};

$scope.ismeridian = true;
$scope.toggleMode = function() {
  $scope.ismeridian = ! $scope.ismeridian;
};
$scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

$scope.toppings = [
    { category: 'basic', name: 'PARKING' },
    { category: 'basic', name: 'FLOOR' },
    { category: 'basic', name: 'PERSONAL INSTRUCTOR' },
    { category: 'basic', name: 'TRADEMILL' },
    { category: 'basic', name: 'CARDIO' },
    { category: 'basic', name: 'MINIRAL WATER' },
    { category: 'basic', name: 'FIRST AID' },
    { category: 'basic', name: 'STEAM BATH' },
    { category: 'Special', name: 'LOCKER ROOM' },
    { category: 'Special', name: 'AC' },
    { category: 'Special', name: 'WIFI' },
    { category: 'Special', name: 'PERSONAL INSTRUCTOR' },
    { category: 'Special', name: 'DEIT PLANNING' },
    { category: 'Special', name: 'LOUNGE' },
    { category: 'Special', name: 'STREAGTH AREA' }
  ];

  $scope.days = [
    { status: 'open', name: 'MONDAY' },
    { status: 'open', name: 'TUESDAY' },
    { status: 'open', name: 'WEDNASDAY' },
    { status: 'open', name: 'THURSDAY' },
    { status: 'open', name: 'FRIDAY' },
    { status: 'open', name: 'SATURDAY' },
    { status: 'open', name: 'SUNDAY' },
    { status: 'close', name: 'MONDAY' },
    { status: 'close', name: 'TUESDAY' },
    { status: 'close', name: 'WEDNASDAY' },
    { status: 'close', name: 'THURSDAY' },
    { status: 'close', name: 'FRIDAY' },
    { status: 'close', name: 'SATURDAY' },
    { status: 'close', name: 'SUNDAY' },
  ];
  vm.openingDays = [];

vm.selectedToppings = [];
console.log($scope.selectedToppings );
vm.printSelectedToppings = function() {
    var numberOfToppings = vm.selectedToppings.length;
debugger;
    // If there is more than one topping, we add an 'and'
    // to be gramatically correct. If there are 3+ toppings
    // we also add an oxford comma.
    if (numberOfToppings > 1) {
      var needsOxfordComma = numberOfToppings > 2;
      var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
      var lastTopping = lastToppingConjunction +
          vm.selectedToppings[vm.selectedToppings.length - 1];
      return vm.selectedToppings.slice(0, -1).join(', ') + lastTopping[0].name;
    }

    return vm.selectedToppings.join('');
  };
  
vm.sectionmobo=function(data,zoneData){
    debugger;
    if(!data){
        $scope.zone_basics=false;
        $scope.zone_setting=true;
        $scope.zone_upload=true;
        $scope.pricing=true;
    }else if(zoneData){
    if(data=="zone_basics"){
       
    $scope.zone_basics=false;
    $scope.zone_setting=true;
    $scope.zone_upload=true;
    $scope.pricing=true;
    
    }else if(data=="zone_setting"){
       
        if(zoneData.Country && zoneData.city && zoneData.aboutZone&&zoneData.zoneName && zoneData.zoneSince && zoneData.zoneOwnerName && zoneData.zoneFor && zoneData.zoneAddress&& zoneData.selectedFacilities && zoneData.openingDays){
        $scope.zone_basics="done";
        $scope.zone_setting=false;
        $scope.zone_upload=true;
        $scope.pricing=true;
        }else{
            $scope.showAlert(null, "Please fill out the details")
        }
    
      
    }else if(data=="zone_upload"){
        if(zoneData.zoneMemberPlanExpireMessage && zoneData.zoneMemberActivateMessage && zoneData.zonefreeTrailPerDay&&zoneData.zoneShortDescription && zoneData.morningTiming && zoneData.eveningTime && zoneData.zoneMemberDeactivateMessage && zoneData.zonefreeTrailPerMonth&& zoneData.primaryContact){
        $scope.zone_basics="done";
    $scope.zone_setting="done"
    $scope.zone_upload=false;
    $scope.pricing=true;
        }else{
            $scope.showAlert(null, "Please fill out the details")
        }
        
    }else if(data=="pricing"){
        if(zoneData.vidurl){
        $scope.zone_basics="done";
    $scope.zone_setting="done";
    $scope.zone_upload="done";
        $scope.pricing=false;
        }else{
            $scope.showAlert(null, "upload images/videos or add urls")
        }
        
    }
}
else{
    $scope.showAlert(null, "Aaaha! please fillout details")
}

}
vm.sectionmobo();
$scope.filelogoAdded=function(file, msg, flow){
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file.file);
    fileReader.onload = function (event) {
    $scope.mockData.logo.url=event.target.result;
    }
    
}
$scope.filecoverAdded=function(file, msg, flow){
    
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file.file);
    fileReader.onload = function (event) {
       
    $scope.mockData.zoneCoverImage.url=event.target.result;
    }
    
}
$scope.fileimagesAdded=function(file, msg, flow){
    debugger;
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file.file);
    fileReader.onload = function (event) {
    $scope.mockData.images.push({"imgId":"","url":event.target.result,"title":""});
    }
    
}
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

vm.live=function(data){
    debugger;
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
    $scope.mockData.primaryContact=data.primaryContact.toString();
    $scope.mockData.videos.url=data.vidurl;
    $scope.mockData.zoneShortDescription=data.zoneShortDescription;
    $scope.mockData.zonefreeTrailPerMonth=Number(data.zonefreeTrailPerMonth);
    $scope.mockData.zonefreeTrailPerDay=Number(data.zonefreeTrailPerDay);
    $scope.mockData.zoneMemberPlanExpireMessage=data.zoneMemberPlanExpireMessage;
    //$scope.mockData.zoneCurrentDiscounts=[data.zoneCurrentDiscounts];
    $scope.mockData.zoneCurrentFacilities=data.selectedFacilities;
    $scope.mockData.zoneFor=data.zoneFor;
    $scope.mockData.openDays=data.openingDays;
    $scope.mockData.zoneSubcriptionDetails=[data.zoneSubcriptionDetails || "silver"];
   
   
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