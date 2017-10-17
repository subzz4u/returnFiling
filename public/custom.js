var app = angular.module("return_file", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService','ui.utils','textAngular','Logger']);
app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider,$httpProvider) {
  checkLoggedin.$inject = ["$q", "$timeout", "$rootScope", "$http", "$state", "$localStorage"];
  checkLoggedout.$inject = ["$q", "$timeout", "$rootScope", "$state", "$http", "$localStorage", "UserModel"];
  $httpProvider.interceptors.push(["$q", "$location", "$window", "$localStorage", function ($q, $location, $window,$localStorage) {
    return {
      request: function (config) {
        var isSignInUrl = config.url.indexOf('login') > -1 ? true : false;
        if($localStorage.token ){
          config.headers = config.headers || {};
          config.headers['Authorization'] = 'bearer '+$localStorage.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          $location.path('/');
        }
        return response || $q.when(response);
      }
    };
  }]);
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
    templateUrl: 'view/common/login.html',
    url: '/login',
    controller:'Login_Controller',
    resolve: {
     loggedout: checkLoggedin
    }
  })
  .state('sign-up', {
    templateUrl: 'view/common/sign_up.html',
    url: '/sign-up',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedin
    }
  })
  .state('dashboard', {
    templateUrl: 'view/dashboard.html',
    url: '/dashboard',
    controller:'Main_Controller',
    resolve: {
      loggedout: checkLoggedout
   }
  })
  .state('profile-update', {
    templateUrl: 'view/profile_update.html',
    url: '/profile-update',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('user-profile', {
    templateUrl: 'view/user_profile.html',
    url: '/user-profile/:user_id',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('user-details', {
    templateUrl: 'view/user_details.html',
    url: '/user-details/:user_id',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('user-list', {
    templateUrl: 'view/user_list.html',
    url: '/user-list/:userType',
    controller:'User_Controller',
    params:{
      userType:null,
    },
    resolve: {
      loggedout: checkLoggedout
    }
  })

  .state('new-user', {
    templateUrl: 'view/new_user.html',
    url: '/new-user',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('return-file', {
    templateUrl: 'view/return_file.html',
    url: '/return-file',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('return-file-list', {
    templateUrl: 'view/return_file_list.html',
    url: '/return-file-list/:status',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('previous-return-file-details', {
    templateUrl: 'view/previous_return_file_details.html',
    url: '/previous-return-file-details/:client_id',
    controller:'Return_Controller',
    params:{
      client_id:null,
     },
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('payment', {
    templateUrl: 'view/payment.html',
    url: '/payment',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 
 .state('returnFile-details', {
    templateUrl: 'view/returnFile-details.html',
    url: '/returnFile-details/:returnFile_id',
    controller:'Return_Controller',
    params:{
      returnFile_id : null,
    },
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('emailConfig', {
    templateUrl: 'view/emailConfig.html',
    url: '/emailConfig',
    controller:'EmailConfig_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('change-password', {
    templateUrl: 'view/change_password.html',
    url: '/change-password',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('forgot-password', {
    templateUrl: 'view/forgot_password.html',
    url: '/forgot-password',
    controller:'User_Controller',
    resolve: {
      loggedout: checkLoggedin
    }
  })
 .state('work-assignment', {
    templateUrl: 'view/work_assignment.html',
    url: '/work-assignment',
    controller:'Work_Assignment_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })

 .state('work-assigned', {
    templateUrl: 'view/works-assigned.html',
    url: '/work-assigned',
    controller:'Work_Assignment_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('work-details', {
    templateUrl: 'view/work_details.html',
    url: '/work-details/:job_id',
    controller:'Work_Assignment_Controller',
    resolve: {
      loggedout: checkLoggedout
    },
     params:{
      job_id:null,

    },
  })
  .state('template', {
    templateUrl: 'view/template.html',
    url: '/template/:_id',
    params:{
      _id:null,
      data:null
    },
    controller:'EmailConfig_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('addTemplate', {
    templateUrl: 'view/template.html',
    url: '/template',
    controller:'EmailConfig_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('referral-list', {
    templateUrl: 'view/referralList.html',
    url: '/referral-list',
    controller:'Referral_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })


  function checkLoggedout($q, $timeout, $rootScope, $state,$http, $localStorage,UserModel) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
    .success(function (response) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
          UserModel.setUser(response.user);
          if($state.current.name == "dashboard" && UserModel.getUser().role.type == "client") {
            $state.go('user-profile');
          }
          console.log("$state >>>>> ",$state.current.name)
          deferred.resolve();
      },200)
    })
    .error(function (error) {
      $timeout(function(){
        $localStorage.token = null;
        $rootScope.is_loggedin = false;
        deferred.resolve();
        $state.go('login');
      },200)
    })
  }
  function checkLoggedin($q, $timeout, $rootScope,$http, $state, $localStorage) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
    .success(function(response) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
        deferred.resolve();
        $state.go('dashboard');
      },200)
    })
    .error(function(error){
      $timeout(function(){
        $localStorage.token = null;
        $rootScope.is_loggedin = false;
        deferred.resolve();
      },200)
    })
  }
}]);
app.run(["$http", "$rootScope", "$localStorage", "$timeout", "EnvService", "Constants", function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $rootScope.stateName = toState.name;
  })
  EnvService.setSettings(Constants);
}]);
app.factory('Util', ['$rootScope',  '$timeout' , function( $rootScope, $timeout){
  var Util = {};
  $rootScope.alerts =[];
  Util.alertMessage = function(msgType, message){
    if(!message){
      message = msgType;
    }
    var alert = { type:msgType , msg: message };
    $rootScope.alerts.push( alert );
    $timeout(function(){
      $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
    }, 5000);
  };
  return Util;
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
;app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("DD MMM, YYYY");
    }
  }
});
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
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0,3).toUpperCase() : '';
    }
});;app.constant("Constants", {
        "debug":true,
        "storagePrefix": "goAppAccount$",
        "getTokenKey" : function() {return this.storagePrefix + "token";},
        "getLoggedIn" : function() {return this.storagePrefix + "loggedin";},
        "alertTime"   : 3000,
        "getUsername" : function() {return this.storagePrefix + "username";},
        "getPassword" : function() {return this.storagePrefix + "password";},
        "getIsRemember" : function() {return this.storagePrefix + "isRemember";},
        "hashKey" : "goAppAccount",
        "envData" : {
          "env":"dev",
          "dev" : {
            "basePath" :"http://localhost",
            "appPath"  :"http://localhost",
          },
          "prod" : {
            "basePath" :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
            "appPath"  :"http://ec2-52-23-158-141.compute-1.amazonaws.com",
          }
        },
});
;angular.module('Logger', [])
  .factory('LOG', ["$rootScope", "$timeout", function($rootScope,$timeout) {
    return {
      debug: function(message) {
        console.log(message);
      },
      info: function(message) {
        var alert = { type:"success" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
      error: function(message) {
        var alert = { type:"error" , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
          $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
      },
    }
  }])
;angular.module('WebService', [])
.factory('API', ["$http", "$resource", "EnvService", function($http, $resource, EnvService) {
  return {
    getRole: {
      "url": "/role/",
      "method": "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    postRole: {
      url: "/role",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    updateRole: {
      url: "/role/",
      method: "PUT",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    deleteRole: {
      url: "/role/:_id",
      method: "DELETE",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    userLogin : {
      url : "/user/login",
      method : "POST"
    },
    getUser : {
      url:"/user/",
      method: "GET"
    },
    postUser: {
      url: "/user/",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    deleteUser: {
        url: "/user/:_id",
        method: "DELETE",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    updateUser: {
        url: "/user/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    postClient: {
      url: "/client",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    postReturnFile: {
      url: "/returnFile",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getcount : {
      url:"/returnFile/count",
      method: "GET"
    },
    getReferral : {
      url:"/returnFile/referral",
      method: "GET"
    },
    getReferralList : {
      url:"/user/referral",
      method: "GET"
    },
    getReturnList : {
      url:"/returnFile",
      method: "GET"
    },
    getItr : {
      url:"/returnFile/itr",
      method: "GET"
    },
    postTransaction: {
      url: "/returnFile/transaction",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getFiscalYear: {
      url:"/returnFile/fiscalYear",
      method: "GET"
    },
    getReturnFile: {
      url:"/returnFile",
      method: "GET"
    },
    updateReturnFile: {
        url: "/returnFile/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    getPaymentList: {
      url:"/returnFile/transaction/payment",
      method: "GET"
    },
    postTemplate: {
      url: "/template",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    putTemplate: {
      url: "/template",
      method: "PUT",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getTemplate: {
      url: "/template",
      method: "GET",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    jobcategoryList:{
      url:"/job",
      method: "GET"
    },
    postAssignment: {
      url: "/jobAssignment",
      method: "POST",
      "headers": {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
    },
    getjobAssignments:{
      url:"/jobAssignment",
      method: "GET"
    },
    updateJobAssignment: {
        url: "/jobAssignment/",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
    forgotPassword: {
        url: "/user/forgotPassword",
        method: "PUT",
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    },
  }
}])
.factory('ApiCall', ["$http", "$resource", "API", "EnvService", "ApiGenerator", function($http, $resource, API, EnvService,ApiGenerator) {
  return $resource('/',null, {
    getRole: ApiGenerator.getApi('getRole'),
    userLogin : ApiGenerator.getApi('userLogin'),
    getUser: ApiGenerator.getApi('getUser'),
    postUser: ApiGenerator.getApi('postUser'),
    getFiscalYear: ApiGenerator.getApi('getFiscalYear'),
    deleteUser: ApiGenerator.getApi('deleteUser'),
    updateUser: ApiGenerator.getApi('updateUser'),
    postReturnFile: ApiGenerator.getApi('postReturnFile'),
    getcount: ApiGenerator.getApi('getcount'),
    getReturnList:ApiGenerator.getApi('getReturnList'),
    getReturnFile:ApiGenerator.getApi('getReturnFile'),
    getItr:ApiGenerator.getApi('getItr'),
    postTransaction: ApiGenerator.getApi('postTransaction'),
    updateReturnFile: ApiGenerator.getApi('updateReturnFile'),
    getPaymentList: ApiGenerator.getApi('getPaymentList'),
    getReferral: ApiGenerator.getApi('getReferral'),
    getTemplate: ApiGenerator.getApi('getTemplate'),
    postTemplate: ApiGenerator.getApi('postTemplate'),
    putTemplate: ApiGenerator.getApi('putTemplate'),
    getReferralList : ApiGenerator.getApi('getReferralList'),
    jobcategoryList :  ApiGenerator.getApi('jobcategoryList'),
    postAssignment:  ApiGenerator.getApi('postAssignment'),
    getjobAssignments:  ApiGenerator.getApi('getjobAssignments'),
    updateJobAssignment:  ApiGenerator.getApi('updateJobAssignment'),
    forgotPassword:  ApiGenerator.getApi('forgotPassword'),
  })
}])

.factory('ApiGenerator', ["$http", "$resource", "API", "EnvService", function($http, $resource, API, EnvService) {
    return {
      getApi: function(api) {
        var obj = {};
        obj = angular.copy(API[api]);
        obj.url = EnvService.getBasePath() + obj.url;
        return obj;
      }
    }
}])

.factory('EnvService',["$http", "$localStorage", function($http,$localStorage){
  var envData = env = {};
  var settings =  {};

  return{
    setSettings : function(setting) {
      settings = setting;
      this.setEnvData(setting.envData);
    },
    getSettings : function(param) {
      if(param){
        return settings[param];
      }
      return null; // default
    },
    setEnvData: function (data) {
      envData = data[data.env];
    },
    getEnvData: function () {
      return envData;
    },
    getBasePath: function (env) {
      return this.getEnvData()['basePath']
    }
  }
}]);
;app.factory("UserModel",function() {
  var userModel = {};
  userModel.setUser = function(user){
    userModel.user = user;
  }
  userModel.getUser = function(user){
    return userModel.user;
  }
  userModel.unsetUser = function(user){
    userModel.user = null ;
  }
  return userModel;
})
;app.controller("EmailConfig_Controller",["$scope", "$timeout", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "UserModel", "Util", "$stateParams", function($scope,$timeout,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){

  $scope.initTemplate = function() {
    $scope.template = {};
    $scope.disabled = false;
    if($stateParams._id){
        $scope.getTemplates($stateParams._id);
        $scope.template.isReadOnly = true;
    }
    else {
      $scope.orightml="";
      $scope.htmlcontent = $scope.orightml;
      $scope.template.isReadOnly = false;
    }
  }
  $scope.getTemplates = function(_id){
    var obj = {};
    if(_id){
      obj._id = _id;
    }
    ApiCall.getTemplate(obj,function(response) {
      if(_id){
        $scope.template = response.data[0];
      }
      else{
        $scope.templateList = new NgTableParams;
        $scope.templateList.settings({
          dataset: response.data
        })
      }
    }, function(error) {
      console.log("Error in fetching templates ",error);
    })
  }

  $scope.updateTemplate = function(){
     console.log($scope.htmlcontent);
     if($stateParams._id) {
       ApiCall.putTemplate($scope.template,function(response) {
         Util.alertMessage('success',response.message);
         $state.go("emailConfig");
       }, function(error) {
         Util.alertMessage('error',response.message);
       })
     }
     else {
       ApiCall.postTemplate($scope.template,function(response) {
         Util.alertMessage('success',response.message);
         $state.go("emailConfig");
       }, function(error) {
         Util.alertMessage('error',response.message);
       })
     }
  }

}]);
;app.controller("Login_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "$timeout", "UserModel", "Util", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel,Util){
  $scope.user = {};
  $scope.user.username = ($localStorage.user) ? $localStorage.user.uname : "";
  $scope.user.password = ($localStorage.user) ? $localStorage.user.password : "";
  $scope.userLogin = function(){
    $rootScope.showPreloader = true;
    ApiCall.userLogin($scope.user ,function(response){
      if($scope.user.rememberMe)
        $localStorage.user = {
          "uname":$scope.user.username,
          "password":$scope.user.password
        }
      $rootScope.showPreloader = false;
      $localStorage.token = response.data.token;
      $rootScope.is_loggedin = true;
      if(response.data.user.role.type == "superAdmin" && !response.data.user.father){
           $state.go('profile-update');
      }
      else if(response.data.user.role.type == "superAdmin" && response.data.user.father){
           $state.go('dashboard');
      }
      else if(response.data.user.father){
        $state.go('user-profile',{'user_id':response.data.user._id});
      }
       else if((response.data.user.role.type !== "superAdmin" || response.data.user.role.type !== "client") && response.data.user.father){
          $state.go('user-profile',{'user_id':response.data.user._id});
      }
      else{
        $state.go('profile-update');
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger',"Invalid username and password");
    })
  }
}]);;/*****************************************************************************************************************/
app.controller("Main_Controller",["$scope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "UserModel", "$uibModal", "$stateParams", "Util", "$timeout", function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal,$stateParams,Util,$timeout){
  $scope.userList = {};
  $scope.dashboard = {};
  $scope.referList = {};
   var loggedIn_user = UserModel.getUser();
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    UserModel.unsetUser();
    $state.go('login');
  }
  $scope.getInternalUsers = function(data){
    $scope.internalCount = 0;
    var obj = {
      'userType':data,
    }
    ApiCall.getUser(obj, function(response){
     $scope.internalCount = response.data.length;
    
      },function(error){
      })
  }
  $scope.getUserDetails = function(){
    var loggedIn_user = UserModel.getUser();
    var obj = {};
    if(loggedIn_user){
        obj._id = loggedIn_user._id;
      }
      console.log(obj);
        ApiCall.getUser(obj, function(response){
          console.log(response);
          $scope.userDetails = response.data;
        },function(error){
        });
      }
  $scope.getClientUsers = function(){
    $scope.clientCount = 0;
    ApiCall.getUser( function(response){
      angular.forEach(response.data, function(item){
            if(item.role.type == "client"){
                $scope.clientCount++;
               }
          });
      },function(error){
      })
  }
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role.type == "superAdmin"){
        $scope.superAdmin = true;
      }
      else{
        $scope.superAdmin = false;
      }
      return  $scope.superAdmin;
  }
  $scope.checkClient = function(){
    $scope.client = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role.type == "client"){
        $scope.client = false;
      }
      else{
        $scope.client = true;
      }
      return  $scope.client;
  }
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
  $scope.deleteUser = function(data){
   $scope.deleteUserId = data._id;
   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/user-delete-modal.html',
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
      $scope.getAllUsers();
    }, function(error) {
    })
  }
  $scope.getReturnCount = function(){
    ApiCall.getcount(function(response){
     $scope.returnFilesCounts = response.data;
    },function(error){
    })
  }
}]);
app.controller('daleteUserModalCtrl',["$scope", "$uibModalInstance", "userDelete", function($scope, $uibModalInstance,userDelete){
  $scope.ok = function () {
    userDelete();
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = new Date();
            $scope.maxDate = new Date();
            $scope.dateMin = null || new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.mode = 'month';

        $scope.initDate = new Date();
        $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
        $scope.format = $scope.formats[4];
        $scope.format1 = $scope.formats[5];

    }
]);
;app.controller("Referral_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "$timeout", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){
	$scope.user = {};
	$scope.getReferralCount = function() {
    var obj = {
      count:true
    }
    ApiCall.getReferral(obj,function(response){
    	console.log(response);
      $scope.dashboard.referralCount = response.data;
      },function(error){
        console.log(error);
      })
  }
   $scope.referralList = function(){
   ApiCall.getReferralList(function(response){
   	console.log(response);
    $scope.referList = response.data;
    $scope.listData = new NgTableParams;
    $scope.listData.settings({
      dataset:$scope.referList
    })
   },function(error){
     console.log("error");
   });
  }

}]);;app.controller("Return_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$stateParams", "$localStorage", "NgTableParams", "ApiCall", "Util", "$timeout", "UserModel", "$uibModal", function($scope,$rootScope,$rootScope,$state,$stateParams,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel,$uibModal){
  $scope.user = {};
  $scope.failTransaction = {};
  $scope.user.isReferalPrompt = false;
  $scope.active_tab1 = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  $scope.user.fiscalYear = '';
   $scope.currentReturnFile = {};

  $scope.active_tab = 'year';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.active_tab1 = 'income';
  $scope.tabChangeDetails = function(tab){
    $scope.active_tab1 = tab;
  }
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
    var loggedIn_user = UserModel.getUser();
    console.log(loggedIn_user);
    if(loggedIn_user && loggedIn_user.role.type == "superAdmin"){
    $scope.superAdmin = true;
    }
    else{
      $scope.superAdmin = false;
    }
    return $scope.superAdmin;
  }
  $scope.checkStatus = function(status, tranId, tranAmt){
    $scope.is_closed = false;
    if($state.current.name == 'payment'){
      if(status == 'closed' || status == 'processing' || tranId == null || tranAmt == 0){
        $scope.is_closed = true;
      }
      return $scope.is_closed;
    }
    else if($state.current.name == 'return-file-list'){
      if(status == 'closed' || status == 'pending'){
        $scope.is_closed = true;
      }
      return $scope.is_closed;
    }
    return $scope.is_closed;
  }
  $scope.checkPending = function(status){
    $scope.is_pending = false;
    if(status == 'closed' || status == 'processing' || status == 'failed'){
       $scope.is_pending = true;
    }
    return  $scope.is_pending;
  }
  $scope.returnFile = function(){
    if($scope.tempFormXvi && $scope.tempFormXvi.imageName){
      $scope.user.formXvi = {
        fileName : $scope.tempFormXvi.imageName,
        base64 : $scope.tempFormXvi.image.split(";base64,")[1]
      }
       $scope.user.isFormXvi = true;
    }

    $scope.user.client = UserModel.getUser()._id;
    if(!$scope.user.isReferalPrompt) {
      $scope.modalInstance = $uibModal.open({
        animation : true,
        templateUrl : 'view/modals/reference_info_modal.html',
        controller : 'ReferalInfoModalController',
        size: 'md',
        resolve:{
          userData : function(){
            return $scope.user
          }
        }
      })
    }
    else {
      ApiCall.postReturnFile($scope.user , function(response){
      Util.alertMessage('success',"Data Saved Successfully");
      var loggedIn_user = UserModel.getUser();
       $state.go('user-profile',{'user_id':loggedIn_user._id});
      },function(error){
        Util.alertMessage('danger',error.data.message);
      })
    }
  }


  $scope.returnFileList = function(){

    var obj = {
      status:$stateParams.status,
    }

   console.log(obj);
    ApiCall.getReturnList(obj, function(response){
      $scope.list = response.data;
      $scope.returnList = new NgTableParams;
      $scope.returnList.settings({
          dataset:$scope.list
      })
    },function(error){
      console.error(error);
    })
  }
  $scope.showFiscalYear = function(){
    var loggedin_user = UserModel.getUser();
    console.log(loggedin_user);
    var obj = {};
    if($state.current.name == "previous-return-file-details" && loggedin_user && loggedin_user.role.type == "superAdmin"){
      obj.client = $stateParams.client_id;
    }

    

    else if($state.current.name == "previous-return-file-details" && loggedin_user && loggedin_user.role.type != "superAdmin"){
      obj.client = loggedin_user._id;
    }
    console.log(obj);
    ApiCall.getFiscalYear(obj, function(response){
      console.log(response);
    $scope.yearList = response.data;
    },function(error){

    });
  }
  $scope.getItrId = function(){
    var loggedin_user = UserModel.getUser();
    var obj = {
      'client' : loggedin_user._id,
    }
    ApiCall.getItr(obj, function(response){
      $scope.itrIdList  = response.data;
    },function(error){

    })
  }
  $scope.changeReturnFileStatus = function(return_id){
    $scope.currentReturnFile = {};
    $scope.currentReturnFile._id = return_id;
    $scope.user.status = "closed";
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }

   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/return-file-closing-modal.html',
      controller : 'ReturnFileClosingModalCtrl',
      size: 'md',
      resolve:{
          userReturnData : function(){
            return $scope.userReturnData
          }
        }

   })
  }
  $scope.userReturnData = function(data){
     $scope.currentReturnFile.returnAmount = data.returnAmount;
     $scope.currentReturnFile.returnDate = data.returnDate;
    $scope.currentReturnFile.status = "closed";
    ApiCall.updateReturnFile($scope.currentReturnFile , function(response){
     console.log(response);
      $state.go('return-file-list');
      },function(error){
    console.log(error);
    })

  }
  $scope.changeStatusProcessing = function(return_id){
    $scope.user._id = return_id;
    $scope.user.status = "processing";
    $scope.user.successMessage = "Payment Success";
    $scope.user.failedMessage = "null";
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }
    ApiCall.updateReturnFile($scope.user , function(response){
    Util.alertMessage('success',"Payment Verified Successfully");
     $state.go('payment');
    },function(error){
      Util.alertMessage("Failed");
    })
  }
  $scope.failTransaction = function(return_data){
    $scope.failedReturnFileId = return_data._id;
    $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/fail-transaction-modal.html',
      controller : 'FailTransacModalCtrl',
      size : 'md',
      resolve:{
        sendFailMessage : function(){
          return $scope.sendFailMessage;
        }
      }
    })
  }
    $scope.sendFailMessage = function(data){
      $scope.returnFileToFail = data;
      $scope.returnFileToFail._id = $scope.failedReturnFileId;
      $scope.returnFileToFail.status = "failed";
      ApiCall.updateReturnFile($scope.returnFileToFail , function(response){
        Util.alertMessage('success',"Transaction Status Successfully Changed To 'Failed' ");
         $state.go('payment');
        },function(error){
          Util.alertMessage('danger',"Failed");
      })
    }
  $scope.returnFileDetails = function(){
    var loggedin_user = UserModel.getUser();
    console.log($state);
    var obj = {};
    if ($state.current.name=="previous-return-file-details" && loggedin_user && loggedin_user.role.type =="superAdmin")
    {
      obj.fiscalYear = $scope.user.fiscalYear;
      obj.client = $stateParams.client_id;
    }
    else if ($state.current.name=="previous-return-file-details" && loggedin_user && loggedin_user.role.type !="superAdmin")
    {
      obj.fiscalYear = $scope.user.fiscalYear;
      obj.client = loggedin_user._id;
    }
    else if ($state.current.name=="returnFile-details" && loggedin_user && loggedin_user.role.type =="superAdmin")
    {
      obj._id = $stateParams.returnFile_id;
    }
    ApiCall.getReturnFile(obj, function(response){
      console.log(response);
      $scope.returnDetails = response.data[0];
      console.log($scope.returnDetails);
      if($scope.returnDetails){
      $scope.returnDetails.total = 0;
      if($scope.returnDetails.conEmpInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.conEmpInc);
      if($scope.returnDetails.businessInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.businessInc);
      if($scope.returnDetails.capitalGainInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.capitalGainInc);
      if($scope.returnDetails.rentalInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.rentalInc);
      if($scope.returnDetails.houseLoanInterestInc)
        $socpe.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.houseLoanInterestInc);
      if($scope.returnDetails.fixDepositInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.fixDepositInc);
      if($scope.returnDetails.savingAcInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.savingAcInc);
      if($scope.returnDetails.otherInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.otherInc);
      if($scope.user.total)
        $scope.returnDetails.total = $scope.user.total.toFixed(2);
    }
    },function(error){

    });
  }
  

  $scope.paymentConfirm = function(){
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }
    ApiCall.postTransaction($scope.user, function(response){
      console.log($scope.user);
      ApiCall.updateReturnFile($scope.user, function(response){
      console.log(response);
      },function(error){
    });
    Util.alertMessage('success',"Payment Confirmed Successfully");
     var loggedIn_user = UserModel.getUser();
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){
    });

  }
  $scope.getPayment = function(){

    ApiCall.getPaymentList(function(response){
      console.log(response);
     $scope.paymentList = response.data;
     $scope.paymentsList = new NgTableParams;
      $scope.paymentsList.settings({
          dataset:$scope.paymentList
      })
    },function(error){

    });

  }
  $scope.getUserDetails = function(row){
    var obj ={
       "_id" : row.client
    }
    ApiCall.getUser(obj, function(response){
      console.log(response);
      row.userDetails = response.data;
    },function(error){
      console.log("error");
    });
  }
  $scope.incomeCalculation = function(){
    $scope.user.total = 0;
    if($scope.user.conEmpInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.conEmpInc);
    if($scope.user.businessInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.businessInc);
    if($scope.user.capitalGainInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.capitalGainInc);
    if($scope.user.rentalInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.rentalInc);
    if($scope.user.houseLoanInterestInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.houseLoanInterestInc);
    if($scope.user.fixDepositInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.fixDepositInc);
    if($scope.user.savingAcInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.savingAcInc);
    if($scope.user.otherInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.otherInc);
    $scope.user.total = $scope.user.total.toFixed(2);
  }

}]);
app.controller('FailTransacModalCtrl',["$scope", "$state", "$uibModalInstance", "sendFailMessage", function($scope, $state, $uibModalInstance,sendFailMessage){
  $scope.failTransaction = {};

  $scope.fail = function () {
    sendFailMessage($scope.failTransaction);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
app.controller('ReferalInfoModalController',["$scope", "$uibModalInstance", "userData", "$uibModal", "Util", function($scope, $uibModalInstance,userData,$uibModal,Util){
  userData.isReferalPrompt = true;
  $scope.ok = function () {
    userData.referralEmail = $scope.referralEmail;
    userData.referralMobile = $scope.referralMobile;
    $uibModalInstance.close();
    $scope.modalInstance = $uibModal.open({
        animation : true,
        templateUrl : 'view/modals/reference_confirm_modal.html',
        controller : 'ReferalConfirmModalController',
        size: 'md',
      })
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
app.controller('ReferalConfirmModalController',["$scope", "$uibModalInstance", function($scope, $uibModalInstance){
  $scope.cancel = function () {
    $uibModalInstance.close('cancel');
  };
}]);
app.controller('ReturnFileClosingModalCtrl',["$scope", "$uibModalInstance", "ApiCall", "userReturnData", function($scope, $uibModalInstance,ApiCall,userReturnData){
  $scope.user = {};
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
   $scope.close = function(){
    userReturnData($scope.user);
    $uibModalInstance.close('cancel');
   };


}]);
;app.controller("User_Controller", ["$scope", "$timeout", "LOG", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "UserModel", "Util", "$stateParams", function($scope, $timeout, LOG, $rootScope, $state, $localStorage, NgTableParams, ApiCall, UserModel, Util, $stateParams) {
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};
  $scope.userDetails = {};
  $scope.roles = [];
  $scope.userList = [];
  $scope.clientUserList = {};

  $scope.active_tab = 'details';
  $scope.tabChange = function(tab) {
    $scope.active_tab = tab;
  }
  $scope.getRoll = function(isSignup) {
    ApiCall.getRole(function(response) {
      if (isSignup) { // in case of signUp , set role as client
        angular.forEach(response.data, function(item) {
          if (item.type == "client") {
            $scope.user.role = item._id;
          }
        });
      } else {
        angular.forEach(response.data, function(item) {
          if (item.type == "client" || item.type == "superAdmin") {} else {
            $scope.roles.push(item);
          }
        });

      }

    })
  }
  $scope.checkPassword = function(password, confirmPassword) {
    if (password != confirmPassword) {
      $scope.showPasswordMisMatch = true;
    }
    if (password == confirmPassword) {
      $scope.showPasswordMisMatch = false;
    }
  }
  $scope.registerUser = function() {
    $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response) {
      $rootScope.showPreloader = false;
      if (response.statusCode == 200) {
        Util.alertMessage('success', "You have successfully register please check your mail");
        $state.go('login');
      } else {
        Util.alertMessage('danger', "Something went wrong please try again");
      }
    }, function(error) {
      if (error.data.statusCode == 500) {
        if (error.data.data.errors.email) {
          Util.alertMessage('danger', error.data.data.errors.email.message);
        } else if (error.data.data.errors.mobile) {
          Util.alertMessage('danger', error.data.data.errors.mobile.message);
        }
        $rootScope.showPreloader = false;
      }
    })
  }
  $scope.profileUpdate = function() {
    if ($scope.tempAdhar.imageName) {
      $scope.user.adharDetails = {
        fileName: $scope.tempAdhar.imageName,
        base64: $scope.tempAdhar.image.split(";base64,")[1]
      }
    }
    if ($scope.tempPAN.imageName) {
      $scope.user.panDetails = {
        fileName: $scope.tempPAN.imageName,
        base64: $scope.tempPAN.image.split(";base64,")[1]
      }
    }
    $scope.user._id = UserModel.getUser()._id;
    $rootScope.showPreloader = true;
    ApiCall.updateUser($scope.user, function(response) {
      $rootScope.showPreloader = false;
      UserModel.setUser(response.data.user);
      $localStorage.token = response.data.token;
      var loggedIn_user = UserModel.getUser();

      Util.alertMessage('success', "Data Updated Successfully");
      $state.go('user-profile', {
        'user_id': loggedIn_user._id
      });
    }, function(error) {
      $rootScope.showPreloader = false;
    })
  }
  $scope.getUserDetails = function(clients_id) {
    $scope.client_id = clients_id;
    $timeout(function() {
      $scope.user = UserModel.getUser();
      if ($scope.user || $stateParams.user_id || $scope.client_id) {
        var obj = {
          "_id": $stateParams.user_id || $scope.user._id || $scope.client_id
        }
        ApiCall.getUser(obj, function(response) {
          console.log(response);
          $scope.userDetails = response.data;
          $scope.userDetails.pin = parseInt($scope.userDetails.pin);
        }, function(error) {})
      }
    });
  }
  $scope.getUser = function(clients_id) {
    $scope.user._id = clients_id;
    if ($scope.user._id) {
      var obj = {
        "_id": $scope.user._id
      }

      ApiCall.getUser(obj, function(response) {
        console.log(response);
        $scope.userDetails = response.data;
      }, function(error) {})
    }
  }
  $scope.getAllUsers = function() {

    var obj = {};
    obj.userType = $stateParams.userType;
    ApiCall.getUser(obj, function(response) {
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
    }, function(error) {})
  }
  $scope.onForgotPassword = function(email) {
    var obj = {
      email: email
    }
    ApiCall.forgotPassword(obj, function(response) {
      LOG.info(response.message);
    }, function(error) {
      LOG.error(response.message);
    })
  }

}]);
;app.controller("Work_Assignment_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "UserModel", "$timeout", "ApiCall", "Util", "$stateParams", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,UserModel, $timeout,ApiCall,Util,$stateParams){
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
$scope.checkInternalUser = function(){
    $scope.internalUser = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user && loggedIn_user.role.type == "client"){  
      	console.log("client");
        $scope.internalUser = false;
      }
      else if(loggedIn_user && loggedIn_user.role.type == "superAdmin"){
        console.log("yeah bro superAdmin");
        $scope.internalUser = false;
      }
      else{
      	console.log("internal  inside work controller");
        $scope.internalUser = true;
      }
      return  $scope.internalUser;
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
  $scope.pendingJobs = [];
  $scope.processJobs = [];
  $scope.completedJobs = [];
 	var loggedIn_user = UserModel.getUser();
 	var obj = {};
 	if(loggedIn_user && loggedIn_user.role.type !== "superAdmin"){
 		 obj.user = loggedIn_user._id;
 	}
 	ApiCall.getjobAssignments(obj, function(response){	
    console.log(response);
 		$scope.jobAssignmentList = response.data;
 		$scope.jobData = new NgTableParams;
 		$scope.jobData.settings({
 			dataset:$scope.jobAssignmentList
 		})
    $scope.pendingJobs = [];
  $scope.processJobs = [];
  $scope.completedJobs = [];
   angular.forEach(response.data, function(item){
            if(item.status == "pending"){
              $scope.pendingJobs.push(item);
               }
              else if(item.status == "In_Progress"){
                $scope.processJobs.push(item);
              }
              else if(item.status == "Completed"){
                $scope.completedJobs.push(item);
              }
          });
   console.log($scope.pendingJobs);
    console.log($scope.processJobs);
    console.log($scope.completedJobs);
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
}]);
;app.directive('fileModell', ['$parse', function ($parse) {
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
app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      scope: {
         fileread: "=",
         filename: "=",
      },
      link: function(scope, element, attrs) {
         element.bind('change', function(){
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
               scope.$apply(function(){
                  scope.fileread = e.target.result;
                  scope.filename = element[0].files[0].name;
               });
            };
            fileReader.readAsDataURL(element[0].files[0]);
         });
      }
   };
}]);
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('floatsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                    var transformedInput = text.replace(/[^[0-9\.]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('capitalize', ["uppercaseFilter", "$parse", function(uppercaseFilter, $parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(inputValue){
            input = inputValue.toLowerCase();
           var capitalized = input.substring(0,3).toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
          }
         }
         var model = $parse(attrs.ngModel);
         modelCtrl.$parsers.push(capitalize);
         capitalize(model(scope));
     }
   };
}]);