/*! returnFiling - v0.0.0 - Thu Aug 31 2017 08:36:10 */
var app = angular.module("return_file", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx']);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
      templateUrl: 'view/common/login.html',
      url: '/login',
	    controller:'Main_Controller',
      //resolve: {
        //loggedout: checkLoggedin
      //}
  })
  .state('sign-up', {
      templateUrl: 'view/common/sign_up.html',
      url: '/sign-up',
      controller:'Main_Controller',
     // resolve: {
        //loggedout: checkLoggedin
     // }
  })
  .state('dashboard', {
    templateUrl: 'view/dashboard.html',
    url: '/dashboard',
    //resolve: {
      //loggedout: checkLoggedout
    //}
  })
  .state('profile', {
    templateUrl: 'view/profile.html',
    url: '/profile',
    //resolve: {
      //loggedout: checkLoggedout
    //}
  })
  .state('return-file', {
    templateUrl: 'view/return_file.html',
    url: '/return-file',
    controller:'Main_Controller',
    //resolve: {
      //loggedout: checkLoggedout
    //}
  })
 
  
  function checkLoggedout($q, $timeout, $rootScope, $state, $localStorage) {
    var deferred = $q.defer();
    //accessToken = localStorage.getItem('accessToken')
    $timeout(function(){
      if($localStorage.user){
        deferred.resolve();
      }
      else{
        deferred.resolve();
        $state.go('login');
      }
    },100)
  }
  function checkLoggedin($q, $timeout, $rootScope, $state, $localStorage) {
    var deferred = $q.defer();
    // accessToken = localStorage.getItem('accessToken')
    $timeout(function(){
      if($localStorage.user){
        deferred.resolve();
        $state.go('dashboard');
      }
      else{
        deferred.resolve();
      }
    },100)
  }
});
app.constant('CONFIG', {
  'HTTP_HOST': 'server/api.php'
})
app.run(function($http,$rootScope,$localStorage,$timeout){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $rootScope.stateName = toState.name;
  })
});
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts =[];
    Util.alertMessage = function(msgType, message){
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
    };
    return Util;
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
             scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
 }]);
 app.filter('getShortName', function () {
     return function (value) {
       if(value){
         var temp = angular.copy(value);
         temp = temp.split(" ");
         temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
         return temp.toUpperCase();
       }
     };
 });
;app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.directive('updateHeight',function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $ta = element;
            var window_height = $(window).height();
            $ta.css({
              'min-height':window_height - 100+'px'
            })
        }
    };
});
;app.controller('ClientController',function($scope,$rootScope,Util,$uibModal,$stateParams,NgTableParams,ClientService,ApiCall){
	
	/*FOR DIRECTOR INCREMENT STARTS HERE*/
				$scope.emp = {};	
				$scope.emp.add=[
				{
					       'name':'',
					'designation':'',
					         'id':'',
						   'pan' :'',
				    	
				}
			];	
				$scope.removeEmp=function($index){
					$scope.emp.add.splice($index,1);
					
				}
				$scope.updateEmployee = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.emp.add.push(obj);
				}
					

/*FOR DIRECTOR INCREMENT ENDS HERE*/


/*FOR SHARE HOLDERS INCREMENT startS HERE*/
				$scope.shares = {};
				$scope.shares.list=[
				{
					       'name':'',
					'designation':'',
					         'id':'',
						   'pan' :'',
				    	
				}
			];	
				$scope.removeShare=function($index){
					$scope.shares.list.splice($index,1);
					
					
				}
				$scope.newShare = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.shares.list.push(obj);
				}
	

	/*FOR SHARE HOLDERS INCREMENT ends HERE*/
	
	/*FOR SHARE Capital INCREMENT startS HERE*/
				$scope.capital = {};
				$scope.capital.list=[
				{
					       'amount':'',
						   	 'year':'',
					   
				    	
				}
			];	
				$scope.removeCapital=function($index){
					$scope.capital.list.splice($index,1);
					
					
				}
				$scope.newCapital = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.capital.list.push(obj);
				}
	

	/*FOR SHARE Capital INCREMENT ends HERE*/
	
	/*Clientlist table view code starts here*/
				$scope.clientList={};
			    $scope.getClientList = function(){
			    	ApiCall.getClient(function(response){
			    		console.log(response);
			    		$scope.clientList = response.data;
			    		$scope.clientData = new NgTableParams();
			    		$scope.clientData.settings({
			    			dataset: $scope.clientList
			    		})

			    	},function(error){

			    	})	
			    }
    /*Clientlist table view code ends here*/
	
});app.controller('FirmController',function($scope,$rootScope,Util,$uibModal,$stateParams,ApiCall,$state,UserModel){
	
	$scope.partners = {};	
	$scope.partners.list = [
  	{
  		'name':'',
  		'designation':'',
  		'membership':'',
  	}
	];	
	$scope.removePart = function($index){
		$scope.partners.list.splice($index,1);
		
	}
	$scope.updatePart = function(){
		var obj = {name:'' ,designation:'', membership:'' };
		$scope.partners.list.push(obj);
	}
	$scope.getRoleList = function(){
     ApiCall.getRole(function(response){
      $scope.roleList = response.data;
     },function(error){

     })
  }
  $scope.caFirmRegister = function(){
  	ApiCall.postUser($scope.caFirm, function(response){
      if(response.statusCode == 200)
  		  Util.alertMessage('success',response.message);
  	},function(error){

  	})
  }
  $scope.updateCaFirm = function(){
  	$scope.caFirm.admin = UserModel.getUser()._id;
    $scope.caFirm.Partners = $scope.partners.list;
  	ApiCall.postCaFirm($scope.caFirm, function(response){
  		if(response.statusCode == 200){
        Util.alertMessage('success',response.message);
  		  $state.go('ca-firm');
      }
  	},function(error){

  	})
  }
  $scope.data = {};
  $scope.getCaFirmDetails = function(){
  	$scope.data = UserModel.getUser();
    	var obj = {
      "_id":"599823699345e92a141e2cba"
    }
    ApiCall.getCaFirm( function(response){
      console.log(response);

    },function(error){

    })

	}
});	app.controller('LoginCtrl',function($scope,$rootScope,LoginService,$state,$window,$localStorage,UserModel, ApiCall, $timeout){
	$scope.user = {};
	$scope.userLogin = function(){
		$rootScope.showPreloader = true;
		ApiCall.userLogin($scope.user, function(response){
			$rootScope.showPreloader = false;
			$rootScope.is_loggedin = true;
		 	$localStorage.token = response.data.token;
			//UserModel.setUser(response.data.user);
			// 	$scope.$emit("Login_success");
			console.log("login success");
			$timeout(function() {
				$state.go('dashboard');
			},500);
		},function(error){
			$rootScope.showPreloader = false;
			$rootScope.is_loggedin = false;
		})
	}
})
;/******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams){
    $scope.user = {};
    console.log($scope.user);

















});
 /*******************************************************/
  /*****Main controller ends here******/
  /*******************************************************/
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
;app.controller("role_controller", function($scope, $rootScope, $state, UserModel, $localStorage, ApiCall, NgTableParams, RoleService,$uibModal,Util) {
  $scope.roles = {};
  $scope.crudRole = function(method, data) {
    var loggedIn_user = UserModel.getUser();
    switch (method) {
      case 'get':
      var obj = {};
        if(loggedIn_user && loggedIn_user.caFirm){
          obj.caFirm = loggedIn_user.caFirm;
        }
        ApiCall.getRole(obj,function(res) {
          $scope.roleList = res.data;
          $scope.role = new NgTableParams;
          $scope.role.settings({
            dataset: $scope.roleList
          })
        }, function(error) {
          console.log(err);
        })
        break;
      case 'delete':
        $scope.deleteId = data._id;
        $scope.modalInstance = $uibModal.open({
         animation: true,
         templateUrl: 'views/modals/role-delete-modal.html',
         controller: 'RoleModalCtrl',
         size: 'md',
         resolve: {
           deleteRole: function () {
             return $scope.deleteRole;
           }
         }
        })
        break;
      case 'create' :
        $rootScope.showPreloader = true;
        if(loggedIn_user.caFirm)
          $scope.roles.caFirm = loggedIn_user.caFirm;
        ApiCall.postRole($scope.roles, function(response){
          if(response.statusCode == 200){
            $rootScope.showPreloader = false;
            Util.alertMessage('success',response.message);
            $state.go('role-list');
          }
        },function(error){
          $rootScope.showPreloader = false;
        })
        break;
      case 'update' :
         $scope.updateId = data._id;
         $scope.modalInstance = $uibModal.open({
          animation : true,
          templateUrl: 'views/modals/role-update-modal.html',
          controller: 'RoleUpdateModalCtrl',
          size: 'md',
          resolve:{
            updateRole : function(){
              return $scope.updateRole;
            },
            role : function(){
              return data;
            }
          }
         })
         break;

         
      default:

    }
    $scope.deleteRole = function(){
      ApiCall.deleteRole({
        _id: $scope.deleteId
      }, function(res) {
        $scope.crudRole('get');
      }, function(error) {
        console.log(err);
      })
    }
    $scope.updateRole = function(role){
      ApiCall.updateRole(role,function(res) {
        $scope.crudRole('get');
      }, function(error) {
        console.log(err);
      }
      )
    }

  }

});
app.controller('RoleModalCtrl', function ($scope, $uibModalInstance,deleteRole) {
    $scope.ok = function () {
        deleteRole();
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
   
});
app.controller('RoleUpdateModalCtrl', function ($scope, $uibModalInstance,updateRole,role) {
  $scope.role = role;
    $scope.update = function () {
        updateRole($scope.role);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
   
});
;app.controller('TrailController',function($scope,$http,$rootScope,Util,$uibModal,$stateParams){
	$scope.trail = {};	
	$scope.selectedFiles = null;
	 $scope.msg = "";  
	$scope.read= function(workbook){
		console.log(JSON.stringify(workbook));
	} 
});app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,Util,$uibModal,UserModel){
  var loggedIn_user = UserModel.getUser();
/*******************************************************/
  /*************This is use for change user-list tabs**********/
  /******************************************************/


  $scope.tabChange = function(tab){
    var data = {};
    // getuser list based on the tab selected
    if(tab._id){
      data.role = tab._id;
    }
    $scope.getUserList(data);
    $scope.active_tab = tab.type;
  }




  /*******************************************************/
  /*************This is use for check user login**********/
  /******************************************************/



  $scope.userlist = {};
  $scope.getUserList = function(data){
      var obj1 = {};
      if(loggedIn_user && loggedIn_user.caFirm){
      obj1.caFirm = loggedIn_user.caFirm;
    }
    obj1 = angular.extend(obj1, data);
    ApiCall.getUser(obj1, function(response){
      console.log(response);
      $scope.userlist = response.data;
      $scope.userData = new NgTableParams();
      $scope.userData.settings({
          dataset: $scope.userlist
      })
    },function(error){

    })
  }
  /********************************************************************************/
  /*************This is use for show CaFirm users in th cafirm admin tabs**********/
  /********************************************************************************/
  
  /*****************************************************************/
  /*This is used for getting the rolelist for user role dropdown****/
  /*****************************************************************/



  $scope.clientRoleList = function(){
      var obj = {};

    if(loggedIn_user && loggedIn_user.caFirm){
      obj.caFirm = loggedIn_user.caFirm;
    }
    $scope.roleList = [];
     ApiCall.getRole(obj, function(response){
       // added dummy index for all users
       var temp = {
         type:"All Users",
       }
       $scope.roleList[0] = temp;
      $scope.roleList = $scope.roleList.concat(response.data);
      $scope.active_tab = $scope.roleList[0].type;
      $scope.tabChange($scope.roleList[0]);// calling with default tab change
     },function(error){

     })
  }

  /*************************************************************************************************************************/

   /*******************************************************/
  /*************This is used for creating a new user****/
  /******************************************************/
   $scope.user = {};
  $scope.createUser = function(){
    //var loggedIn_user = UserModel.getUser();
     if(loggedIn_user && loggedIn_user.caFirm){
      $scope.user.caFirm = loggedIn_user.caFirm;
    }
   // $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response){
      if(response.statusCode == 200){
        Util.alertMessage('success', response.message);
        $state.go('user-list');
      }
    },function(error){
        console.log(error);
         $rootScope.showPreloader = false;
    })
  }
  /*************************************************************************************************************************/

   /*******************************************************/
  /*************This is used for deleting a  user****/
  /******************************************************/
  $scope.deleteUser = function(data){
    console.log(data);
   $scope.deleteUserId = data._id;
   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'views/modals/user-delete-modal.html',
      controller : 'daleteUserModalCtrl',
      size: 'md',
      resolve:{
            userDelete : function(){
               return $scope.userDelete;
            }
      }

   })
  }
  $scope.userDelete = function(){
      ApiCall.deleteUser({
        _id: $scope.deleteUserId
      }, function(res) {
        Util.alertMessage('success', res.message);
        $scope.getUserList();
      }, function(error) {
        console.log(err);
      })
    }
    /*************************************************************************************************************************/


   /*******************************************************/
  /*************This is used for updating a  user****/
  /******************************************************/
  $scope.updateUser = function(data){
    $scope.updateUserId = data._id;
    $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'views/modals/user-update-modal.html',
      controller : 'updateUserModalCtrl',
      size : 'md',
      resolve:{
        userUpdate : function(){
          return $scope.userUpdate;
        },
        users : function(){
          return data;
        }
      }
    })
  }
  $scope.userUpdate = function(users){
    ApiCall.updateUser(users,function(response){
              console.log(123454);
              $scope.getUserList();
           },function(error){
              console.log(error);
         }
       )
     }
});



app.controller('daleteUserModalCtrl',function($scope, $uibModalInstance,userDelete){
  $scope.ok = function () {
        userDelete();
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('updateUserModalCtrl',function($scope, ApiCall,$uibModalInstance,userUpdate,users){
  $scope.getRolesList = function(){
     ApiCall.getRole(function(response){
      $scope.roleList = response.data;
     },function(error){

     })
  }

  $scope.users = users;
  $scope.update = function () {
        userUpdate($scope.users);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});
;app.service('LoginService',function($q,$http){
	return{
		
		jsonLogin : function(user){
			var deffered = $q.defer();
			$http.get('local.json').then(function successCallback(response) {
				console.log(response);
				angular.forEach(response.data.user,function(item){
					console.log(response);
					if(item.user_name == user.username && item.password == user.password){
						deffered.resolve(item);
					

					}
					
				})
	        }, function errorCallback(errorResponse) {
	        
	            deffered.reject(errorResponse);
	        });
	        return deffered.promise;
		}
	}
})
app.service('UserService',function($q,$http){
	return{
				userList : function(){
					var response = $http.get('local.json');
					console.log(response);
					return response;}
			}
})
app.service('ClientService',function($q,$http){
	return{
				clientList : function(){
					var response=$http.get('local.json');
					console.log(response);
					return response;

				}
	}
})
app.service('RoleService',function($q,$http){
	return{
			role : function(){
				var response = $http.get('local.json');
				console.log(response);
				return response
			}

			}
})
