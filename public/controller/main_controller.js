/*******************************************************/

  /******Main controller ends here******/
  /*******************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal){

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
  $scope.checkUpdate = function(){
    var loggedIn_user = UserModel.getUser();
    if(loggedIn_user.firstname){
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    }
    else{
      
      $state.go('profile');
    }

  }
  $scope.deleteUser = function(data){
    console.log(data);
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
        $scope.getUserList();
      }, function(error) {
        console.log(err);
      })
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
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("User_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};

  $scope.active_tab = 'details';
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }

  /*******************************************************/

  /*********FUNCTION IS USED TO GET ROLE LIST*************/
  /*******************************************************/
  $scope.getRoll = function() {
    ApiCall.getRole(function(response){
      angular.forEach(response.data,function(item){
        if(item.type == "client"){
          $scope.user.role = item._id; 
        }
      })
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK PASSOWORD***********/
  /*******************************************************/
  $scope.checkPassword = function(password, confirmPassword) {
    if(password != confirmPassword){
      $scope.showPasswordMisMatch = true;
    }
    if(password == confirmPassword){
      $scope.showPasswordMisMatch = false;
    }
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO REGISTER A USER***********/
  /*******************************************************/
  $scope.registerUser = function(){
    $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response){
      $rootScope.showPreloader = false;
      if(response.statusCode == 200){
        Util.alertMessage('success',"You have successfully register please check your mail");
      }
      else{
        Util.alertMessage('danger',"Something went wrong please try again");
      }
    },function(error){
      $rootScope.showPreloader = false;
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO REGISTER A USER***********/
  /*******************************************************/
  $scope.getUserDetails = function(){
    $scope.user = UserModel.getUser();
    console.log($scope.user);
  }
  /*******************************************************/
  /********FUNCTION IS USED TO UPDATE PROFILE INFO********/
  /*******************************************************/
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
    ApiCall.updateUser($scope.user , function(response){
      console.log(response);
    },function(error){

    })
  }



$scope.userDetails = {};
$scope.getUser = function(){
  var obj = {
    "_id": $stateParams.user_id
  }
  ApiCall.getUser(obj, function(response){
    $scope.userDetails = response.data;
    console.log($scope.userDetails);
  },function(error){
    console.log("error");
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

}
});
/*----------------------------------------------------------------------------------------------------------------------------------*/
                        /*-------------------------------------------------------------------------------*/
