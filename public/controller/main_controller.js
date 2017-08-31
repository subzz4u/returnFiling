/*******************************************************/
  /******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams){
  $scope.signOut = function(){
    delete $localStorage.token;
    $scope.is_loggedin = false;
    $state.go('login');
  }
  
  $scope.active_tab = 'income';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
});


/*******************************************************/
  /******User controller starts here******/
  /*******************************************************/
app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel){
    $scope.user = {};
    $scope.tempAdhar = {};
    $scope.tempPAN = {};
   $scope.register = function(){
  $scope.user.role = "59a67678cc865a0ec49ccc80";
    ApiCall.postUser($scope.user , function(response){
      console.log(response);
     },function(error){

     })
   }

   $scope.getUserDetails = function(){
    $scope.user = UserModel.getUser();
    console.log($scope.user);
   }


  if($scope.tempAdhar.imageName){
    $scope.user.adharDetails = $scope.tempAdhar.image.split(";base64,")[1];
  }
  if($scope.tempPAN.imageName){
    $scope.user.panDetails =  $scope.tempPAN.image.split(";base64,")[1];
  }
 $scope.profileUpdate = function(){
 
  ApiCall.updateUser($scope.user , function(response){
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
  /*****Payment controller starts here******/
  /*******************************************************/
app.controller("Payment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){


});

  
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
