var app = angular.module("return_file", ['ui.router', 'ui.bootstrap', 'ngResource', 'ngStorage', 'ngAnimate','datePicker','ngTable','angular-js-xlsx','WebService']);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage) {
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
  });
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
    //resolve: {
      // loggedout: checkLoggedin
     // }
  })
  .state('dashboard', {
    templateUrl: 'view/dashboard.html',
    url: '/dashboard',
    controller:'Main_Controller',
    resolve: {
      loggedout: checkLoggedout
   }
  })
  .state('profile', {
    templateUrl: 'view/profile.html',
    url: '/profile',
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
  .state('return-file', {
    templateUrl: 'view/return_file.html',
    url: '/return-file',
    controller:'Return_Controller',
    resolve: {
      loggedout: checkLoggedout
    }
  })
 .state('payment', {
    templateUrl: 'view/payment.html',
    url: '/payment',
    controller:'Payment_Controller',
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
            // if(UserModel.getUser())
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
});
app.constant('CONFIG', {
  'HTTP_HOST': 'server/api.php'
})
app.run(function($http,$rootScope,$localStorage,$timeout,EnvService,Constants){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $rootScope.stateName = toState.name;
  })
  EnvService.setSettings(Constants);
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

// app.directive('fileModel', ['$parse', function ($parse) {
//     return {
//        restrict: 'A',
//        link: function(scope, element, attrs) {
//           var model = $parse(attrs.fileModel);
//           var modelSetter = model.assign;

//           element.bind('change', function(){
//              scope.$apply(function(){
//                 modelSetter(scope, element[0].files[0]);
//              });
//           });
//        }
//     };
//  }]);
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
