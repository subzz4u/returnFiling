app.controller("Login_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,UserModel){
  $scope.user = {};
  $scope.user.username = ($localStorage.user) ? $localStorage.user.uname : "";
  $scope.user.password = ($localStorage.user) ? $localStorage.user.password : "";
  /*******************************************************/
  /*********FUNCTION IS USED TO SIGN IN PROFILE***********/
  /*******************************************************/
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
      if(response.data.user.firstname){
        $state.go('user-profile',{'user_id':response.data.user._id});
      }
      else{
        $state.go('profile-update');
      }
    },function(error){

    })
  }
});