app.controller("User_Controller",function($scope,$timeout,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};
  $scope.active_tab = 'details';
  $scope.userDetails = {};

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
  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER DETAILS**********/
  /*******************************************************/
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
  // /******************************************************************************/
  // /*********FUNCTION IS USED TO GET USER DETAILS during update by admin **********/
  // /******************************************************************************/
  // $scope.getUserUpdates = function(){
  //    $scope.user = UserModel.getUser();
  //   // var loggedIn_user = UserModel.getUser();
  //   // if(!loggedIn_user){
  //   //   return;
  //   // }
  //   // $stateParams.user_id = loggedIn_user._id;
  //   var obj = {
  //     "_id": $stateParams.user_id || UserModel.getUser()._id
  //   }
  //   ApiCall.getUser(obj, function(response){
  //     $scope.user = response.data;
  //   },function(error){

  //   })
  // }

});
