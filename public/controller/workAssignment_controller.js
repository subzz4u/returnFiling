app.controller("Work_Assignment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams, $timeout,ApiCall){
	$scope.user = {};
	$scope.categoryList = {};
	$scope.task = {};
	$scope.assignmentList = {};
	$scope.roles  = [];
	$scope.userList = {};
	// $scope.paymentConfirm = function(){
	// 	ApiCall.postTransaction($scope.user , function(response){
	// 		console.log("posted");

	// 	},function(error){

	// 	});
	// }
	$scope.getList = function(){
		ApiCall.getCatList(function(response){
			console.log(response);
		},function(error){

		});
	}
	$scope.getJobCategoryList = function(){
		ApiCall.jobcategoryList(function(response){
			console.log(response);
			$scope.categoryList = response.data;
			console.log($scope.categoryList);
		},function(error){

		});

	}
	$scope.getAssignmentList = function(){
		var obj = {
			'_id': $scope.task.category,
		}
		ApiCall.jobcategoryList(obj, function(response){
			$scope.assignmentList = response.data[0].assignment;
			console.log($scope.assignmentList);
		},function(error){

		});		

	}
	$scope.getRoles = function(){
		ApiCall.getRole(function(response){
			angular.forEach(response.data, function(item){
         	  if(item.type == "client" || item.type == "superAdmin"  ){
               }
              else{
             		$scope.roles.push(item);
             	}
        	});
		},function(error){
	});
  }
  $scope.getUserOfSelectedrole = function(){
      var obj = {
        "role" : $scope.task.role
      }
      	console.log(obj);
    ApiCall.getUser(obj, function(response){
     $scope.userList = response.data;
    },function(error){
  });
 }

 $scope.workAssignConfirm = function(){
 	ApiCall.postAssignment($scope.task, function(response){
 		console.log(response);

 	},function(error){

 	});
 }
  
});