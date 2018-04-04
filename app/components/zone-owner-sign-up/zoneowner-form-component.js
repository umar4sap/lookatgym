(function() {
    'use strict';

    angular
        .module('zoneapp')
        .controller('zoneownerFormController', zoneownerFormController);

        zoneownerFormController.$inject = ['authService', 'zoneService','$scope', '$window'];

    function zoneownerFormController(authService, zoneService,$scope, $window) {

        var vm = this;
        vm.authService = authService;

        //loader
      //  $scope.loginLoader = $window.sessionStorage.getItem("loginLoader");

     vm.mockData= {
        "email": "jack@test.com",
        "name": "jack",
        "password": "Jack@123",
        "app_metadata": {
          "ownership": "citizen",
          "Access_Reason": "string",
          "register_Type": "string",
          "status": "pending",
          "phone_number": "9881246627",
          "username": "jack"
        },
        "user_metadata": {},
        "connection": "Username-Password-Authentication"
      }

      $scope.$watch('vm.signupData.confirmpassword', function(value) {
          debugger;
        if(vm.password==value){
            vm.passwordError=false;
        }else{
            vm.passwordError="password doesn't match";
        }
      });
      vm.userRegistration = function(data) {
        debugger;
        vm.inprogress= true,
        vm.determinateValue=30;
        
  
            
            
            vm.mockData.email=data.email;
            vm.mockData.name=data.name;
            vm.mockData.password=data.confirmpassword;
            vm.mockData.app_metadata=data.app_metadata;
            
        zoneService.createUser(vm.mockData,function(err,res) {

            
            if(!err){
                vm.inprogress = false;
            
               
                alert("Signup Success")
                document.querySelector('.cont-sing-up').classList.toggle('s--signup');
                vm.signupData="";
            
        }else{
            
            vm.inprogress = false;
            alert(err.message)
            signupData="";
        }
           
        })
    }
    var webAuth = new auth0.WebAuth({
        domain: "zones.auth0.com",
        clientID: "cO02S01qm4vmAp2jhUtuLI4iAfQgXNx4",
        responseType: 'code',
       
        //audience:'https://dhruvnewgen.auth0.com/userinfo'
    });
        vm.getToken= function (data) {
            debugger;
            webAuth.client.login({
                realm: "Username-Password-Authentication",
                username: data.username,
                password: data.password,
                scope: "openid profile app_metadata email"
            }, function (err, authResult) {
                // Auth tokens in the result or an error
                if (err) {
                    console.log(err)
                    alert("err")
                }
                else {
                   var userDetails = authResult;
                   console.log("details"+userDetails)
                }
            });        
        }
    
      
       
        

    
}

}());