    (function () {
        'use strict';

        angular
            .module('zoneapp')
            .controller('ModalInstanceCtrlManagersDetails', function ($uibModalInstance,branchData,$scope, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
                var vm = this;
               debugger;
                vm.branchData = branchData;
              debugger;
                vm.ok = function () {
                  $uibModalInstance.close(vm.selected.item);
                };
              
                vm.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
                };
              
                $scope.showAlert = function(ev,msg) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application
                    // to prevent interaction outside of dialog
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Trainer Action')
                        .textContent(msg)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('okay!')
                        .targetEvent(ev)
                    );
                  };
                vm.createBranch=function(ownershipId,data){
                   debugger;
                    zoneService.createBranch(ownershipId,data,function(err,res){
                        console.log(res)
                        if(!err){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"branch created");
                           
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating manager");
                        }
                        
                    })
                }
                vm.addManager=function(ownershipId,branchId,email){
                  vm.inprogress=true;
                  zoneService.addManagerToBranch(ownershipId,branchId,email,function(err,res){
                    console.log(res)
                    if(!err){
                        debugger;
                     vm.inprogress=false;   
                     $uibModalInstance.dismiss('cancel');
                      $scope.showAlert(null,res.data.message);      
                    }else{
                       
                        vm.inprogress=false; 
                        $uibModalInstance.dismiss('cancel');
                        $scope.showAlert(null,"Error while adding member please check manager's email should registered"); 
                    }
                    
                })
                 }
                vm.getAllBranches=function(ownershipId){
                   
                    zoneService.getBranches(ownershipId,function(err,res){
                        console.log(res)
                        if(!err){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                          
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while getting branches");
                          
                            $scope.trainercreation=false;
                        }
                        
                    })
                }
                vm.getBranchDetails=function(ownershipId,branchId){
                   
                    zoneService.getBranchDetails(ownershipId,branchId,function(err,res){
                        console.log(res)
                        if(!err){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                           
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while getting branches");
                          
                            $scope.trainercreation=false;
                        }
                        
                    })
                }
                vm.addManagerToBranch=function(ownershipId,branchId,memberEmail){
                   
                    zoneService.addManagerToBranch(ownershipId,branchId,memberEmail,function(err,res){
                        console.log(res)
                        if(!err){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                         
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while adding manager");
                         
                            $scope.trainercreation=false;
                        }
                        
                    })
                }
                vm.deleteManagerFromBranch=function(ownershipId,branchId,memberEmail){
                   
                    zoneService.deleteManagerFromBranch(ownershipId,branchId,memberEmail,function(err,res){
                        console.log(res)
                        if(!err){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                          
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while deleting trainer");
                         
                            $scope.trainercreation=false;
                        }
                        
                    })
                }


               

                vm.edittrainer=function(data){
                    var stringdata=data.zoneInfo;
                    debugger;
                    data.zoneInfo=JSON.parse(stringdata)
                    $scope.trainermock.trainerName=data.trainerName;
                    $scope.trainermock.zoneName=data.zoneInfo.zoneName;
                    $scope.trainermock.trainerFee=data.trainerFee;
                    $scope.trainermock.abouttrainer=data.abouttrainer;
                    $scope.trainermock.trainerMonth=data.trainerMonth;
                    $scope.trainermock.trainerOffer=data.trainerOffer || "none";
                    $scope.trainermock.offerValidity=data.offerValidity || "none";
                   
                    zoneService.updateTrainerById(vm.trainerData,$scope.trainermock,function(res){
                        console.log(res)
                        if(res.data.status==200){
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,res.data.data.message);
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }else{
                            $uibModalInstance.dismiss('cancel');
                            $scope.showAlert(null,"error while creating trainer");
                            vm.getAlltrainers();
                            $scope.trainercreation=false;
                        }
                        
                    })
                }



                vm.getAlltrainers=function(){
                    
                    zoneService.getAllTrainers(function(response){
                        debugger;
                        vm.trainers=response.data.data
                    })
                }
            })
              
            .controller('zonemanagersDetailsController', zonemanagersDetailsController);

            zonemanagersDetailsController.$inject = ['$scope', '$state','$stateParams','$rootScope', 'authService', 'zoneService','$location', '$http', '$q', '$mdDialog', 'moment', '$filter','$uibModal', '$log', '$document'];

        function zonemanagersDetailsController($scope,$state,$stateParams, $rootScope, authService, zoneService,$location, $http, $q, $mdDialog, moment, $filter,$uibModal, $log, $document) {
            var vm = this;
            vm.inprogress=true;
            vm.ownershipIds = $stateParams.ownershipId;
            vm.branchId = $stateParams.branchId;
            var userProfile = localStorage.getItem('profile');
            $scope.userProfile = JSON.parse(userProfile);
            vm.authService = authService;
            vm.ownershipsLab=$scope.userProfile['https://lookatgym.com/permissions'].permissions.ownerships[0]
            vm.ownerships=Object.keys($scope.userProfile['https://lookatgym.com/permissions'].permissions.ownerships[0])
             
            vm.go = function (path) {
                $location.path(path);
   
            };
            vm.owners=[]
            
            vm.childBranch=[]
            vm.ownersObject=[{
              "name": "owners",
              "img": "http://www.gravatar.com/avatar/a70796a247d24b369607ceabf5ce0baa?s=140",
              "children":vm.childBranch
            }]
            vm.treebranch=[{
                "name": vm.ownerships[0],
                "img": "https://placehold.it/100x100/11ff99",
                "children": vm.ownersObject,
            }]  
            vm.managers;
            vm.getAllBranches=function(ownershipId){
                   debugger;
                zoneService.getBranches(ownershipId,function(err,res){
                    console.log(res)
                    if(!err){
                        debugger;
                     vm.branches=res.data;
                     vm.inprogress=false;
                    
                  debugger;
                 
                    vm.branches.forEach(function(currentValue, index){
                      
                        if(currentValue.branch!='owners'){
                          
                          vm.childBranch.push({"name": "Branch, "+currentValue.branch,
                          "img": "http://www.gravatar.com/avatar/a70796a247d24b369607ceabf5ce0baa?s=140"})
                        }
                    
                    })
                      if( vm.branches[0].role=='admin'){
                        debugger;
                          vm.isAdmin=true;
                      }else{
                        vm.isAdmin=false;
                      }
                        
                    }else{
                        $scope.showAlert(null,"error while getting branches");
                      
                    }
                    
                })
            }
            vm.getBranchDeatilsPage=function (path,ownershipId,branchId) {
              debugger;
              $state.go(path,{ 'ownershipId': ownershipId, 'branchId': branchId });
          };

            vm.getBranchDeatils=function(ownershipId,branchId){
              debugger;
           zoneService.getBranchDetails(ownershipId,branchId,function(err,res){
               console.log(res)
               if(!err){
                   debugger;
                vm.managers=res.data.users;
                vm.branchInfo=res.data.branchInfo;
                vm.inprogress=false;
               
                 if( vm.branches[0].role=='admin'){
                     vm.isAdmin=true;
                 }else{
                   vm.isAdmin=false;
                 }
                   
               }else{
                   alert("error")
                 
               }
               
           })
       }
       vm.getBranchDeatils(vm.ownershipIds,vm.branchId)

     

            vm.getAllBranches(vm.ownerships[0]);

            $scope.newtrainer=function(){
                $scope.trainercreation=true;

            }

            vm.cancel=function(){
                $scope.trainercreation=false;
            }
            vm.list=true;
            vm.viewType=function(data){
                debugger;
                if(data=="list"){
                    vm.list=true;
                    vm.grid=false;
            }else{
                vm.grid=true;
                vm.list=false;
            }
        }



  vm.animationsEnabled = true;

  vm.open = function (size,ownerId,branchId) {
      debugger;
   
    $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controller: 'ModalInstanceCtrlManagersDetails',
      templateUrl: 'components/zone-branch-managers/zone-branch-managers-dialog.html',
      controllerAs: 'vm',
      size: size,
      resolve: {
        branchData: function () {
          return {BranchMode:"open",ownershipId:ownerId,branchId:branchId};
        }
    }
    
    });
}

vm.edit = function (size,trainerId,zoneId) {
    debugger;
 
  $uibModal.open({
    animation: vm.animationsEnabled,
    ariaLabelledBy: 'modal-title',
    ariaDescribedBy: 'modal-body',
    controller: 'ModalInstanceCtrlManagersDetails',
    templateUrl: 'components/zone-managers/zone-managers-edit-dialog.html',
    controllerAs: 'vm',
    size: size,
    resolve: {
        branchData: function () {
          return {BranchMode:"edit",ownershipId:ownershipId,branchId:branchId};
        }
    }
  
  });
}




var treebranch = [{
    "name": vm.ownerships[0],
    "img": "https://placehold.it/100x100/11ff99",
    "children": [{
      "name": vm.ownershipsLab[vm.ownerships[0]].branchs,
      "img": "http://www.gravatar.com/avatar/a70796a247d24b369607ceabf5ce0baa?s=140",
      "children": [{
        "name": "Me",
        "img": "https://placehold.it/100x100/0f0f0f",
        "children": [{
          "name": "No",
          "img": "https://placehold.it/100x100/654934",
        }, {
          "name": "One",
          "img": "https://placehold.it/100x100/83275f",
        }, {
          "name": "Else",
          "img": "https://placehold.it/100x100/19827a",
        }]
      }, {
        "name": "Myself",
        "img": "https://placehold.it/100x100/faa855",
        "children": [{
          "name": "Not",
          "img": "https://placehold.it/100x100/786fc9",
        }, {
          "name": "Here",
          "img": "https://placehold.it/100x100/18ffaa",
        }]           
      }, {
        "name": "I",
        "img": "https://placehold.it/100x100/8746fa",
        "children": [{
          "name": "Nothing",
          "img": "https://placehold.it/100x100",
        }]
      }]
    }, {
      "name": "Someone Else",
      "img": "https://placehold.it/100x100/666667",
      "children": [{
        "name": "Yes",
        "img": "https://placehold.it/100x100/6a7",
      }, {
        "name": "Man",
        "img": "https://placehold.it/100x100/1aa",
      }]
    }]
  }];
  
  /* Inital Variables */ 
  // Size of the svg
  var size = 800;
  
  var radius = 40;
  var fontSize = 15;
  var id = 0;
  var animationDuration = 750;
  var root;
  var nodeCount;
  
  var tree = d3.layout.tree()
    .size([size, size]);
  
  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });
  
  var svg = d3.select("#d3Hierarchy").append("svg")
    .attr("width", size)
    .attr("height", size)
    .append("g");
  
  // Create a circle for cropping
  svg.append("clipPath")
    .attr("id", "circle")
    .append("circle")
    .attr("r", radius);
  
  // Set the root of the tree
  root = vm.treebranch[0];
  root.fromX = size / 2;
  root.fromY = 0;
  
  function collapse(d) {
    if (d.children) {
      d.hidden = d.children;
      d.hidden.forEach(collapse);
      d.children = null;
    }
  }
  
  // Collapse the inital tree down to just the root
  root.hidden = root.children;
  root.children.forEach(collapse);
  update(root);
  
  d3.select(self.frameElement).style("height", "800px");
  
  // Count the number of nodes on each line to center the tree
  function countNodes(node){
    if(!nodeCount[node.depth]){
      nodeCount.push(0);
    }
    nodeCount[node.depth]++;
    if(node.children){
      node.children.forEach(countNodes);
    }
  }
  
  function update(source) {
  
    var nodes = tree.nodes(root).reverse();
    var links = tree.links(nodes);
  
    nodeCount = [];
    countNodes(root);
    
    // Set the hights of the nodes (ultimately trying to center them)
    nodes.forEach(function(d) { 
      d.y = ((d.depth + 1) * size) / (nodeCount.length + 2); 
    });
  
    /* Node Logic */
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++id); });
  
    // Initialize the node on entry
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + source.fromX + "," + source.fromY + ")"; })
      .on("click", click);
  
    // Set the node's image
    nodeEnter.append("image")
      .attr("xlink:href", function(d) { return d.img })
      .attr("r", 1e-6)
      .attr("clip-path", "url(#circle)");
  
    // Set the node's text
    nodeEnter.append("text")
      .attr("y", function(d) { return -(radius + fontSize)})
      .attr("text-anchor", 'middle')
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
      .style("font-size", fontSize);
  
    // Update the node after entry
    var nodeUpdate = node.transition()
      .duration(animationDuration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    // Move the node 
    nodeUpdate.select('image')
      .attr('x', radius * -1)
      .attr('y', radius * -1)
      .attr('width', radius * 2)
      .attr('height', radius * 2)
      .style('opacity', 1)
      .each('interrupt', fixOpacity)
      .each('end', fixOpacity);
    
    // In case of interrupted animation, the opacity will still be one
    function fixOpacity(){
      d3.selectAll('g').style("opacity", 1);
    }
  
    nodeUpdate.select("text")
      .style("fill-opacity", 1);
  
    // Initalize the node leaving 
    var nodeExit = node.exit().transition()
      .duration(animationDuration)
      .attr("transform", function(d) { 
        return "translate(" + source.x + "," + source.y + ")"; })
      .style("opacity", 0)
      .remove();
      
    nodeExit.select("text")
      .style("fill-opacity", 1e-6);
  
    /* Link Logic */
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });
  
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var change = {x: source.fromX, y: source.fromY};
        return diagonal({source: change, target: change});
      });
  
    link.transition()
      .duration(animationDuration)
      .attr("d", diagonal);
  
    link.exit().transition()
      .duration(animationDuration)
      .attr("d", function(d) {
        var change = {x: source.x, y: source.y};
        return diagonal({source: change, target: change});
      })
      .remove();
  
    nodes.forEach(function(d) {
      d.fromX = d.x;
      d.fromY = d.y;
    });
  }
  
  // When a node is clicked, hide all of the unrelated nodes and show all the children
  function click(d) {
    if (d.parent) {
      d.parent.children = [d];
    }
    if(d.hidden) {
      d.children = d.hidden;
      d.children.forEach(hide);
    }
    update(d);
  }
  
  function hide(d) {
    if (d.children) {
      d.hidden.forEach(hide);
      d.children = null;
    }
  }
  
  
 
        }
    }());