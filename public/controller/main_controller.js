/*******************************************************/
  /******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams){
   
});
/*******************************************************/
  /******User controller starts here******/
  /*******************************************************/
app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall){
    $scope.user = {};
   $scope.register = function(){
   $scope.user.role = "59a67678cc865a0ec49ccc80";
   ApiCall.postUser($scope.user , function(response){
    console.log(response);
   },function(error){

   })
 }
});


/*******************************************************/
  /******Login controller starts here******/
  /*******************************************************/

app.controller("Login_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){
    $scope.user = {};
    $scope.userLogin = function(){
      ApiCall.userLogin($scope.user ,function(response){
        $rootScope.showPreloader = false;
        $rootScope.is_loggedin = true;
        $localStorage.token = response.data.token;
        console.log("login success");
      $timeout(function() {
        $state.go('dashboard');
      },500);
      },function(error){

      })
    }





});






 /*******************************************************/
  /*****Main controller ends here******/
  /*******************************************************/
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
