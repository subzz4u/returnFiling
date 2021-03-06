app.controller("User_Controller", function($scope, $timeout, LOG, $rootScope, $state,$location, $window,$localStorage, NgTableParams, ApiCall, UserModel, Util, $stateParams) {
  $scope.user = {};
  $scope.tempAdhar = {};
  $scope.tempPAN = {};
  $scope.userDetails = {};
  $scope.roles = [];
  $scope.userList = [];
  $scope.clientUserList = {};
  $scope.changePass = {};
  $scope.active_tab = 'details';
  var loggedIn_user = UserModel.getUser();
  $scope.tabChange = function(tab) {
    $scope.active_tab = tab;
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET ROLE LIST*************/
  /*******************************************************/
  $scope.getRoll = function(isSignup) {
    ApiCall.getRole(function(response) {
      if (isSignup) { // in case of signUp , set role as client
        angular.forEach(response.data, function(item) {
          if (item.type == "client") {
            $scope.user.role = item._id;
          }
        });
      } else {
        angular.forEach(response.data, function(item) {
          if (item.type == "client" || item.type == "superAdmin") {} else {
            $scope.roles.push(item);
          }
        });

      }

    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK Old PASSOWORD***********/
  /*******************************************************/
  // $scope.checkOldPassword = function(oldPassword) {
  //   var loggedIn_user = UserModel.getUser();
  //   console.log(loggedIn_user.password);
  //   if(oldPassword != loggedIn_user.password){
  //     $scope.oldPasswordMisMatch = true;
  //     console.log("not equal");
  //   }
  //   if(oldPassword == loggedIn_user.password){
  //     $scope.oldPasswordMisMatch = false;
  //     console.log("equal");
  //   }

  // }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK PASSOWORD***********/
  /*******************************************************/
  $scope.checkPassword = function(password, confirmPassword) {
    if (password != confirmPassword) {
      $scope.showPasswordMisMatch = true;
    }
    if (password == confirmPassword) {
      $scope.showPasswordMisMatch = false;
    }
  }
 /*******************************************************/
  /*********FUNCTION IS USED TO CHANGE PASSOWORD***********/
  /*******************************************************/
  $scope.changePassword = function(){
    $rootScope.showPreloader = true;
    ApiCall.changePassword($scope.changePass, function(response) {
      console.log(response);
      $rootScope.showPreloader = false;
      LOG.info(response.message);
      $state.go('user-profile', {'user_id': loggedIn_user._id});
    },function(error){
      $rootScope.showPreloader = false;
       if(error.data.statusCode == 401){
        LOG.error(error.data.message);
       }
    });

  }
  /*******************************************************/
  /*********FUNCTION IS USED TO REGISTER A USER***********/
  /*******************************************************/
  $scope.registerUser = function() {
    $rootScope.showPreloader = true;
    ApiCall.postUser($scope.user, function(response) {
      $rootScope.showPreloader = false;
      if (response.statusCode == 200) {
        Util.alertMessage('success', "You have successfully register please check your mail");
        $state.go('login');
      } else {
        Util.alertMessage('danger', "Something went wrong please try again");
      }
    }, function(error) {
      if (error.data.statusCode == 500) {
        if (error.data.data.errors.email) {
          Util.alertMessage('danger', error.data.data.errors.email.message);
        } else if (error.data.data.errors.mobile) {
          Util.alertMessage('danger', error.data.data.errors.mobile.message);
        }
        $rootScope.showPreloader = false;
      }
    })
  }

  /*******************************************************/
  /********FUNCTION IS USED TO UPDATE PROFILE INFO********/
  /*******************************************************/
  $scope.profileUpdate = function() {
    if ($scope.tempAdhar.imageName) {
      $scope.user.adharDetails = {
        fileName: $scope.tempAdhar.imageName,
        base64: $scope.tempAdhar.image.split(";base64,")[1]
      }
    }
    if ($scope.tempPAN.imageName) {
      $scope.user.panDetails = {
        fileName: $scope.tempPAN.imageName,
        base64: $scope.tempPAN.image.split(";base64,")[1]
      }
    }
    $scope.user._id = UserModel.getUser()._id;
    $rootScope.showPreloader = true;
    ApiCall.updateUser($scope.user, function(response) {
      $rootScope.showPreloader = false;
      UserModel.setUser(response.data.user);
      $localStorage.token = response.data.token;
      var loggedIn_user = UserModel.getUser();
     
      Util.alertMessage('success', "Data Updated Successfully");
      $state.go('user-profile', {
        'user_id': loggedIn_user._id
      });
    

    }, function(error) {
      $rootScope.showPreloader = false;
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER DETAILS**********/
  /*******************************************************/
  $scope.getUserDetails = function(clients_id) {
    $scope.client_id = clients_id;
    $timeout(function() {
      $scope.user = UserModel.getUser();
      $scope.user.dob = new Date($scope.user.dob);
      if ($scope.user || $stateParams.user_id || $scope.client_id) {
        var obj = {
          "_id": $stateParams.user_id || $scope.user._id || $scope.client_id
        }
        ApiCall.getUser(obj, function(response) {
          console.log(response);
          $scope.userDetails = response.data;
          // $scope.userDetails.accNo = parseInt($scope.userDetails.accNo);
          $scope.userDetails.pin = parseInt($scope.userDetails.pin);
        }, function(error) {})
      }
    });
  }
  $scope.getUser = function(clients_id) {
    $scope.user._id = clients_id;
    if ($scope.user._id) {
      var obj = {
        "_id": $scope.user._id
      }

      ApiCall.getUser(obj, function(response) {
        console.log(response);
        $scope.userDetails = response.data;
      }, function(error) {})
    }
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER LIST*************/
  /*******************************************************/
  $scope.getAllUsers = function() {
    $scope.usersType = $stateParams.userType;
    var obj = {};
    obj.userType = $scope.usertype;
    ApiCall.getUser(obj, function(response) {
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
    }, function(error) {})
  }

  /**
   * functionName :onForgotPassword
   * Info : send mail with the password info
   */
  $scope.onForgotPassword = function(email) {
    var obj = {
      email: email
    }
    ApiCall.forgotPassword(obj, function(response) {
    
    }, function(error) {
      LOG.error(error.message);
    })
  }

});
