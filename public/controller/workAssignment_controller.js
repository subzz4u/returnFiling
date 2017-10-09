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
		console.log(obj);
		ApiCall.jobcategoryList(obj, function(response){
			console.log(response);
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
 	if(loggedIn_user.role.type !== "superAdmin"){
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
  $scope.getUserName = function(user_id){
  	console.log("one");
  	var obj = {
  		'_id' : user_id
  	}

  	console.log(obj);
  	ApiCall.getUser(obj, function(response){
      $scope.userDetails = response.data;
      console.log($scope.userDetails);

    },function(error){
      console.log("error");
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
 			$scope.task.role = response.data[0].type;
 		},function(error){

 		});
 		var obz = {
 			'_id' : $scope.task.user
 		}
 		ApiCall.getUser(obz, function(response){
 			console.log(response);
	     $scope.task.user = response.data.email;
	    },function(error){
	  });	
 	},function(error){

 	});
 	console.log($scope.task);
 }
 $scope.updateJobStatus = function(){
 	ApiCall.updateJobAssignment($scope.task, function(response){
 		console.log(response);
 	},function(error){

 	});
 }
});