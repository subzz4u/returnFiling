/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal,$stateParams,$timeout){
  $scope.userList = {};
  $scope.count = {};

  /*******************************************************/
  /*********FUNCTION IS USED TO SIGN OUT PROFILE**********/
  /*******************************************************/
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    $state.go('login');
  }

  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER LIST*************/
  /*******************************************************/
  $scope.getAllUsers = function(){
    ApiCall.getUser(function(response){
      $scope.userList = response.data;
      $scope.userList.nos = response.data.length;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset:$scope.userList
      })
    },function(error){

    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK ADMIN USER**********/
  /*******************************************************/
  $scope.checkAdmin = function(){
    var superAdmin = false;
    $timeout(function() {
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user.role.type == "superAdmin"){
        var superAdmin = true;
      }
      return superAdmin;
    }, 500);
  }
  /*******************************************************/
  /******FUNCTION IS USED TO OPEN DELETE USER MODAL*******/
  /*******************************************************/
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
  /*******************************************************/
  /*********FUNCTION IS USED TO DELETE USER***************/
  /*******************************************************/
  $scope.userDelete = function(){
    ApiCall.deleteUser({
      _id: $scope.deleteUserId
    }, function(res) {
      Util.alertMessage('success', res.message);
      $scope.getUserList();
    }, function(error) {
    })
  }
  /*******************************************************/
  /******FUNCTION IS USED TO GET RETURN FILE COUNT********/
  /*******************************************************/
  $scope.getReturnCount = function(){
    ApiCall.getcount(function(response){
      console.log(response);
     $scope.count.nos = response.data.length;
    },function(error){
    })
  }
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
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
    ApiCall.updateUser($scope.user , function(response){
      var loggedIn_user = UserModel.getUser();
      Util.alertMessage('success',"Data Updated Successfully");
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){

    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER DETAILS**********/
  /*******************************************************/
  $scope.getUserDetails = function(){
    // $scope.user = UserModel.getUser();
    // var loggedIn_user = UserModel.getUser();
    // if(!loggedIn_user){
    //   return;
    // }
    // $stateParams.user_id = loggedIn_user._id;
    var obj = {
      "_id": $stateParams.user_id
    }
    ApiCall.getUser(obj, function(response){
      $scope.userDetails = response.data;
    },function(error){

    })
  }
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
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
        $state.go('user-profile',{'user_id':loggedIn_user._id});
      }
      else{
        $state.go('profile-update');
      } 
    },function(error){

    })
  }
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Payment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){

});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel){
  $scope.user = {};
  $scope.active_tab = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.change = function(){

  }
  /*******************************************************/
  /*********FUNCTION IS USED TO ADD RETURN FILE***********/
  /*******************************************************/
  $scope.returnFile = function(){
    $scope.user.client = UserModel.getUser()._id;
    ApiCall.postReturnFile($scope.user , function(response){
    Util.alertMessage('success',"Data Saved Successfully");
    var loggedIn_user = UserModel.getUser();
     $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){

    })
  }
  /*******************************************************/
  /*******FUNCTION IS USED TO GET RETURN FILE LIST********/
  /*******************************************************/
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
      console.log(response);
      $scope.yearList = response.data;
     // Util.alertMessage('success',"Fiscal year  Successfully");
    },function(error){

    });
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET ITR ID LIST***********/
  /*******************************************************/
  $scope.getItrId = function(){
    ApiCall.getItr(function(response){
      $scope.itrIdList  = response.data;
    },function(error){

    })
  }
  /*******************************************************/
  /*****FUNCTION IS USED TO ADD PAYMENT CONFIRMATION******/
  /*******************************************************/
  $scope.paymentConfirm = function(){
    ApiCall.postTransaction($scope.user, function(response){
     Util.alertMessage('success',"Payment Confirmed Successfully");
     var loggedIn_user = UserModel.getUser();
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){
    });
  }
});

