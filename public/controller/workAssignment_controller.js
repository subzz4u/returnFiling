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
  $scope.createWork = {};
  $scope.taskList = [];
  $scope.assignedJobs = [];
	/*******************************************************/
  /*********FUNCTION IS USED TO GIVE JOB CATEGORY LIST***********/
  /*******************************************************/
	$scope.getJobCategoryList = function(){
		ApiCall.jobcategoryList(function(response){
			$scope.categoryList = response.data;

		},function(error){

		});

	}
	/*******************************************************/
  /*********FUNCTION IS USED TO GIVE aSSIGNMENT LIST UNDER SELECTED CATEGORY**********/
  /*******************************************************/
	$scope.getAssignmentList = function(){
		var obj = {};
    if($state.current.name == 'create-task'){
			obj.category = $scope.createWork.category;
		}
    else if($state.current.name == 'work-assignment'){
      obj.category = $scope.task.category;
    }
		ApiCall.jobcategoryList(obj, function(response){
		  $scope.assignmentList = response.data[0].assignment;
		},function(error){
			console.error(error);
		});

	}
	$scope.showRetunFile = function() {
		if(($scope.task.assignment == "pending" || $scope.task.assignment == "processing" ) && $scope.task.category == "Return File") {
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
	/*******************************************************/
  /*********FUNCTION IS USED TO GET THE ROLES OF INTERNAL USER***********/
  /*******************************************************/
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
  /*******************************************************/
  /*********FUNCTION IS USED TO GIVE INTERNAL USERS OF SELECTED ROLE***********/
  /*******************************************************/
  $scope.getUserOfSelectedrole = function(){
      var obj = {
        "role" : $scope.task.role
      }
    ApiCall.getUser(obj, function(response){
     $scope.userList = response.data;
    },function(error){
  });
 }
 /*******************************************************/
  /*********FUNCTION IS USED TO CHECK AN INTERNAL USER ***********/
  /*******************************************************/
$scope.checkInternalUser = function(){
    $scope.internalUser = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role.type == "client"){  
        $scope.internalUser = false;
      }
      else if(loggedIn_user && loggedIn_user.role.type == "superAdmin"){
        $scope.internalUser = false;
      }
      else{
        $scope.internalUser = true;
      }
      return  $scope.internalUser;
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO Assign a job***********/
  /*******************************************************/
 $scope.workAssignConfirm = function(){
  $scope.task._id = $scope.task.workName;
  delete $scope.task['workName'];
  
 	$rootScope.showPreloader = true;
 	ApiCall.updateJobAssignment($scope.task, function(response){
 		$rootScope.showPreloader = false;
 		Util.alertMessage('success',"Job Assigned Successfully");
 		$state.go('dashboard');
 	},function(error){

 	});
 }
 /*******************************************************/
  /*********FUNCTION IS USED TO GIVE ASSIGNED JOB LIST ***********/
  /*******************************************************/
 $scope.getAssignedJobs = function(){
 	var loggedIn_user = UserModel.getUser();
 	var obj = {};
 	if(loggedIn_user && loggedIn_user.role.type !== "superAdmin"){
 		 obj.user = loggedIn_user._id;
 	}
 	ApiCall.getjobAssignments(obj, function(response){	
 		// $scope.jobAssignmentList = response.data;
 		// $scope.jobData = new NgTableParams;
 		// $scope.jobData.settings({
 		// 	dataset:$scope.jobAssignmentList
 		// })
  $scope.pendingAssignedJobs = [];
  $scope.processAssignedJobs = [];
  $scope.completedAssignedJobs = [];
  $scope.assignedJobs = [];
  $scope.taskList = [];
   angular.forEach(response.data, function(item){
      if(item.user){
        $scope.assignedJobs.push(item);
      }
      else{
        $scope.taskList.push(item);
      }
     });    
       $scope.assignedJobData = new NgTableParams;
       $scope.assignedJobData.settings({
       dataset:$scope.assignedJobs
       })
        $scope.notAssignedJobData = new NgTableParams;
       $scope.notAssignedJobData.settings({
       dataset:$scope.taskList
       })
       console.log($scope.assignedJobs);
      angular.forEach($scope.assignedJobs,function(item){
        if(item.status == "pending"){
              $scope.pendingAssignedJobs.push(item);
               }
              else if(item.status == "In_Progress"){
                $scope.processAssignedJobs.push(item);
              }
              else if(item.status == "Completed"){
                $scope.completedAssignedJobs.push(item);
              }
      });
         
         
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
 		var obj = {};
    if($scope.task.role){
 			obj._id = $scope.task.role;
      ApiCall.getRole(obj, function(response){
 			  $scope.roleType = response.data[0].type;
 		    },function(error){
       });
      }
 		var obz = {
 			'_id' : $scope.task.user
 		}
 		ApiCall.getUser(obz, function(response){
	     $scope.userFirstname = response.data.firstname;
	     $scope.userLastname = response.data.lastname;
	    },function(error){
	  });
 	},function(error){

 	});
 }
 $scope.updateJobStatus = function(){
 	ApiCall.updateJobAssignment($scope.task, function(response){
 		Util.alertMessage('success',"Status Updated Successfully");
 		$state.go('work-assigned');
 	},function(error){

 	});
 }
 $scope.taskCreation = function(){
  var loggedIn_user = UserModel.getUser();
  if(loggedIn_user && loggedIn_user.role.type == "client"){
      $scope.createWork.createdBy = loggedIn_user._id;
      $scope.createWork.createdFor = loggedIn_user._id;
    }
    $rootScope.showPreloader = true;
    ApiCall.postAssignment($scope.createWork, function(response){
      $rootScope.showPreloader = false;
      Util.alertMessage('success',"Job created Successfully");
      $state.go('user-profile',{'user_id':loggedIn_user._id});
     },function(error){
      console.log("error");
  });
 }
 $scope.getTaskList = function(){
  $scope.taskList = [];
  var loggedIn_user = UserModel.getUser();
  var obj = {};
  if(loggedIn_user && loggedIn_user.role.type == "client"){
     obj.createdFor = loggedIn_user._id;
  }
    ApiCall.getjobAssignments(obj, function(response){
      $scope.jobAssignmentList = response.data;
      angular.forEach($scope.jobAssignmentList,function(item){
        if(item.user){
         // $scope.assignedJobs.push(item);
        }
        else{
          $scope.taskList.push(item);
        }
      });

      $scope.createdTaskData = new NgTableParams;
      $scope.createdTaskData.settings({
      dataset:$scope.jobAssignmentList
    })
    },function(error){

    });
 }
$scope.getTaskDetails = function(){
  var obj = {
    '_id' : $scope.task.workName
    }
    ApiCall.getjobAssignments(obj, function(response){
      $scope.task.category = response.data[0].category;
      $scope.task.assignment = response.data[0].assignment;
      $scope.task.description = response.data[0].description;
    },function(error){

    });
}
});
