var app = angular.module("return_file", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService','ui.utils']);
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
  .state('user-list', {
    templateUrl: 'view/user_list.html',
    url: '/user-list',
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
    url: '/return-file-list',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('return-file-details', {
    templateUrl: 'view/return_file_details.html',
    url: '/return-file-details',
    controller:'Return_Controller',
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
  
  function checkLoggedout($q, $timeout, $rootScope, $state,$http, $localStorage,UserModel) {
    var deferred = $q.defer();
    $http.get('/user/loggedin')
    .success(function (response) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
          UserModel.setUser(response.user);
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
            "basePath" :"http://localhost:4000",
            "appPath"  :"http://localhost:4000",
          },
          "prod" : {
            "basePath" :"http://localhost:4000",
            "appPath"  :"http://localhost:4000",
          }
        },
});
;angular.module('WebService', [])
.factory('API', ["$http", "$resource", "EnvService", function($http, $resource, EnvService) {
  return {
    getRole: {
      "url": "/role/",
      "method": "GET",
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
      if(response.data.user.mobile){
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
  $scope.count = {};
  $scope.users = {};
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    $state.go('login');
  }
  $scope.getAllUsers = function(){
    ApiCall.getUser(function(response){
      $scope.users.nos = response.data.length;
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
      },function(error){
      })
  }
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
    $timeout(function() {
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user.role.type == "superAdmin"){
        $scope.superAdmin = true;
      }
    }, 500);
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
     $scope.count.nos = response.data.length;
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
            $scope.minDate = null; //$scope.minDate = null || new Date();
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
;app.controller("Payment_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "$timeout", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){

}]);;app.controller("Return_Controller",["$scope", "$rootScope", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "Util", "$timeout", "UserModel", function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel){
  $scope.user = {};
  $scope.active_tab1 = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  $scope.active_tab = 'year';
  $scope.user.fiscalYear = '';

  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.tabChangeDetails = function(tab){
    $scope.active_tab1 = tab;
  }
  $scope.change = function(){

  }
  $scope.returnFile = function(){
    $scope.user.client = UserModel.getUser()._id;
    ApiCall.postReturnFile($scope.user , function(response){
    Util.alertMessage('success',"Data Saved Successfully");
    var loggedIn_user = UserModel.getUser();
     $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){

    })
  }
  $scope.returnFileList = function(){
    ApiCall.getReturnList(function(response){
      $scope.list = response.data;
      $scope.returnList = new NgTableParams;
      $scope.returnList.settings({
          dataset:$scope.list
      })
    },function(error){

    })
  }
  $scope.showFiscalYear = function(){
    
    ApiCall.getFiscalYear(function(response){
      
      $scope.yearList = response.data;
      console.log($scope.yearList);
    },function(error){

    });
  }
  $scope.getItrId = function(){
    ApiCall.getItr(function(response){
      $scope.itrIdList  = response.data;
    },function(error){

    })
  }
  $scope.returnFileDetails = function(){
    var obj = {
      fiscalYear:$scope.user.fiscalYear
    }
    ApiCall.getReturnFile(obj, function(response){
      $scope.returnDetails = response.data[0];
      console.log($scope.returnDetails);
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
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.houseLoanInterestInc);
      if($scope.returnDetails.fixDepositInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.fixDepositInc);
      if($scope.returnDetails.savingAcInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.savingAcInc);
      if($scope.returnDetails.otherInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.otherInc);
      $scope.returnDetails.total = $scope.user.total.toFixed(2);
    },function(error){

    });
  }
  $scope.paymentConfirm = function(){
    ApiCall.postTransaction($scope.user, function(response){
     Util.alertMessage('success',"Payment Confirmed Successfully");
     var loggedIn_user = UserModel.getUser();
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){
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
;app.controller("User_Controller",["$scope", "$timeout", "$rootScope", "$state", "$localStorage", "NgTableParams", "ApiCall", "UserModel", "Util", "$stateParams", function($scope,$timeout,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};
  $scope.active_tab = 'details';
  $scope.userDetails = {};

  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.getRoll = function() {
    ApiCall.getRole(function(response){
      angular.forEach(response.data,function(item){
        if(item.type == "client"){
          $scope.user.role = item._id;
        }
      })
    })
  }
  $scope.checkPassword = function(password, confirmPassword) {
    if(password != confirmPassword){
      $scope.showPasswordMisMatch = true;
    }
    if(password == confirmPassword){
      $scope.showPasswordMisMatch = false;
    }
  }
  $scope.registerUser = function(){
    $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
        Util.alertMessage('success',"You have successfully register please check your mail");
        $state.go('login');
      }
      else{
        Util.alertMessage('danger',"Something went wrong please try again");
      }
    },function(error){
    console.log(error);
     Util.alertMessage('danger',error.data.data.errors.username.message);
      $rootScope.showPreloader = false;
    })
  }
  $scope.profileUpdate = function(){
    if($scope.tempAdhar.imageName){
      $scope.user.adharDetails = {
        fileName : $scope.tempAdhar.imageName,
        base64 : $scope.tempAdhar.image.split(";base64,")[1]
      }
    }
    if($scope.tempPAN.imageName){
      $scope.user.panDetails = {
        fileName : $scope.tempPAN.imageName,
        base64 : $scope.tempPAN.image.split(";base64,")[1]
      }
    }
    $scope.user._id = UserModel.getUser()._id;
    ApiCall.updateUser($scope.user , function(response){
      UserModel.setUser(response.data.user);
      $localStorage.token = response.data.token;
      var loggedIn_user = UserModel.getUser();

      Util.alertMessage('success',"Data Updated Successfully");
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){
      console.log("updateUser  "+error);
    })
  }
  $scope.getUserDetails = function(){
    $timeout(function() {
      $scope.user = UserModel.getUser();
      if($scope.user || $stateParams.user_id){
        var obj = {
          "_id": $stateParams.user_id || $scope.user._id
        }
        ApiCall.getUser(obj, function(response){
          console.log(response);
          $scope.userDetails = response.data;
          $scope.userDetails.accNo = parseInt($scope.userDetails.accNo);
          $scope.userDetails.pin = parseInt($scope.userDetails.pin);
        },function(error){
        })
      }
    });
  }

}]);;app.directive('fileModell', ['$parse', function ($parse) {
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