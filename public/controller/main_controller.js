/*******************************************************/
  /******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel){
  $scope.signOut = function(){
    delete $localStorage.token;
    $scope.is_loggedin = false;
    $state.go('login');
  }

  $scope.active_tab = 'income';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }


  $scope.userList = {};
  $scope.getAllUsers = function(){
    ApiCall.getUser(function(response){
    $scope.userList = response.data;
    $scope.userList.nos = response.data.length;
    console.log($scope.userList);
     $scope.userData = new NgTableParams;
     $scope.userData.settings({
      dataset:$scope.userList
     })
    },function(error){
      console.log("error");
    })
   
  } 

  $scope.checkAdmin = function(){
    var superAdmin = false;
    var loggedIn_user = UserModel.getUser();
    if(loggedIn_user.role._id == "59a67678cc865a0ec49ccc7f"){
      var superAdmin = true;
    }
    return superAdmin;
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


  // if($scope.tempAdhar.imageName){
  //   $scope.user.adharDetails = $scope.tempAdhar.image.split(";base64,")[1];
  // }
  // if($scope.tempPAN.imageName){
  //   $scope.user.panDetails =  $scope.tempPAN.image.split(";base64,")[1];
  // }
 $scope.profileUpdate = function(){
 console.log($scope.tempAdhar.imageName);
 console.log($scope.tempPAN.imageName);
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


/*******************************************************/
  /*****Return controller starts here******/
  /*******************************************************/
app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){

$scope.user = {};
$scope.change = function(){
  var total  = 
}
});
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
