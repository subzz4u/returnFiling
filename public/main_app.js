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
