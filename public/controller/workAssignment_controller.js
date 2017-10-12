app.controller("Work_Assignment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,UserModel, $timeout,ApiCall,Util,$stateParams){
	$scope.user = {};
	$scope.categoryList = {};
	$scope.task = {};
	$scope.assignmentList = {};
	$scope.roles  = [];
	$scope.userList = {};
	$scope.jobAssignmentList = {};
	$scope.jobDetails = {};
	$scope.userDetails = {};
	$scope.getJobCategoryList = function(){
		ApiCall.jobcategoryList(function(response){
			$scope.categoryList = response.data;
		},function(error){

		});

	}
	$scope.getAssignmentList = function(){
		var obj = {
			'category': $scope.task.category,
		}
		// console.log(obj);
		ApiCall.jobcategoryList(obj, function(response){
			console.log(response);
			$scope.assignmentList = response.data[0].assignment;
			console.log($scope.assignmentList);
		},function(error){
			console.error(error);
		});

	}
	$scope.showRetunFile = function() {
		console.log('$scope.task.assignment' ,$scope.task.assignment);
		console.log('$scope.task.category' ,$scope.task.category);
		if($scope.task.assignment == "pending" && $scope.task.category == "Return File") {
			$scope.task.showReturnFile = true;
		}
		else {
			$scope.task.showReturnFile = false;
		}
	}
	$scope.getReturnFiles = function(){
		var obj = {
			status : $scope.task.assignment
		}
		ApiCall.getReturnList(obj, function(response){
			$scope.task.returnFiles = response.data;
    },function(error){
      console.error(error);
    })
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
			console.error(error);
	});
  }
  $scope.getUserOfSelectedrole = function(){
      var obj = {
        "role" : $scope.task.role
      }
    ApiCall.getUser(obj, function(response){
     $scope.userList = response.data;
    },function(error){
  });
 }

 $scope.workAssignConfirm = function(){
 	$rootScope.showPreloader = true;
 	ApiCall.postAssignment($scope.task, function(response){
 		$rootScope.showPreloader = false;
 		Util.alertMessage('success',"Job Assigned Successfully");
 		$state.go('dashboard');
 	},function(error){

 	});
 }
 $scope.getAssignedJobs = function(){
 	var loggedIn_user = UserModel.getUser();
 	var obj = {};
 	if(loggedIn_user && loggedIn_user.role.type !== "superAdmin"){
 		 obj.user = loggedIn_user._id;
 	}
 	console.log(obj);
 	ApiCall.getjobAssignments(obj, function(response){
 		console.log(response);
 		$scope.jobAssignmentList = response.data;
 		$scope.jobData = new NgTableParams;
 		$scope.jobData.settings({
 			dataset:$scope.jobAssignmentList
 		})
 	},function(error){

 	});
 }
  $scope.getUserName = function(row){
  	var obj = {
  		'_id' : row.user
  	}
  	ApiCall.getUser(obj, function(response){
      row.userDetails = response.data;
	},function(error){
    });
  }
  $scope.getJobDetails= function(){
  	var obj = {
  		'_id' : $stateParams.job_id
  	}
 	ApiCall.getjobAssignments(obj, function(response){
 		$scope.task = response.data[0];
 		var obj = {
 			'_id' : $scope.task.role
 		}
 		ApiCall.getRole(obj, function(response){
 			$scope.roleType = response.data[0].type;
 		},function(error){

 		});
 		var obz = {
 			'_id' : $scope.task.user
 		}
 		ApiCall.getUser(obz, function(response){
 			console.log(response);
	     $scope.userFirstname = response.data.firstname;
	     $scope.userLastname = response.data.lastname;
	    },function(error){
	  });
 	},function(error){

 	});
 	console.log($scope.task);
 }
 $scope.updateJobStatus = function(){
 	ApiCall.updateJobAssignment($scope.task, function(response){
 		Util.alertMessage('success',"Status Updated Successfully");
 		$state.go('work-assigned');
 	},function(error){

 	});
 }
});
