app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$stateParams,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel,$uibModal){
  $scope.user = {};
  $scope.active_tab1 = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  $scope.active_tab = 'year';
  $scope.user.fiscalYear = '';
  $scope.muna = {};
  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.tabChangeDetails = function(tab){
    $scope.active_tab1 = tab;
  }
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
    var loggedIn_user = UserModel.getUser();
    console.log(loggedIn_user);
    if(loggedIn_user.role.type == "superAdmin"){
    $scope.superAdmin = true;
    }
    else{
      $scope.superAdmin = false;
    }
    return $scope.superAdmin;
  }
  $scope.checkStatus = function(status, tranId, tranAmt){
    $scope.is_closed = false;
    if($state.current.name == 'payment'){
      if(status == 'closed' || status == 'processing' || tranId == null || tranAmt == 0){
        $scope.is_closed = true;
      }
      return $scope.is_closed;
    }
    else if($state.current.name == 'return-file-list'){
      if(status == 'closed' || status == 'pending'){
        $scope.is_closed = true;
      }
      return $scope.is_closed;
    }
    return $scope.is_closed;
  }
  $scope.checkPending = function(status){
    $scope.is_pending = false;
    if(status == 'closed' || status == 'processing' || status == 'failed'){
       $scope.is_pending = true;
    }
    return  $scope.is_pending;
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
      Util.alertMessage('danger',error.data.message);
    })
  }
  /*******************************************************/
  /*******FUNCTION IS USED TO GET RETURN FILE LIST********/
  /*******************************************************/
  
 
  $scope.returnFileList = function(){
    
    var obj = {
      status:$stateParams.status,
    }

   console.log(obj);
    ApiCall.getReturnList(obj, function(response){
      console.log(response);
      $scope.list = response.data;
      $scope.returnList = new NgTableParams;
      $scope.returnList.settings({
          dataset:$scope.list
      })
    },function(error){

    })
  }
  $scope.showFiscalYear = function(){
    var loggedin_user = UserModel.getUser();
    console.log(loggedin_user);
    var obj = {
      'client' :  $stateParams.client_id,
    } 
    if($state.current.name == "previous-return-file-details" && loggedin_user.role.type == "client"){
      console.log("client login and previous return file details");
      obj.client = loggedin_user._id;
    }
    console.log(obj);
    ApiCall.getFiscalYear(obj, function(response){

      $scope.yearList = response.data;
      console.log($scope.yearList);
     // Util.alertMessage('success',"Fiscal year  Successfully");
    },function(error){

    });
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO GET ITR ID LIST***********/
  /*******************************************************/
  $scope.getItrId = function(){
    ApiCall.getItr(function(response){
      console.log(response);
      $scope.itrIdList  = response.data;
    },function(error){

    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHANGE STATUS OF THE RETURN FILE***********/
  /*******************************************************/
  $scope.changeReturnFileStatus = function(return_id){
    $scope.user._id = return_id;
    $scope.user.status = "closed";
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }
    ApiCall.updateReturnFile($scope.user , function(response){
    Util.alertMessage('success',"Status Changed Successfully");
    var loggedIn_user = UserModel.getUser();
     $state.go('return-file-list');
    },function(error){
      Util.alertMessage("Failed");
    })
  }
  $scope.changeStatusProcessing = function(return_id){
    $scope.user._id = return_id;
    $scope.user.status = "processing";
    $scope.user.successMessage = "Payment Success";
    $scope.user.failedMessage = "null";
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }
    ApiCall.updateReturnFile($scope.user , function(response){
    Util.alertMessage('success',"Payment Verified Successfully");
    var loggedIn_user = UserModel.getUser();
     $state.go('payment');
    },function(error){
      Util.alertMessage("Failed");
    })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO Open a Fail Transaction modal***********/
  /*******************************************************/
  $scope.failTransaction = function(return_id){
    $scope.failedReturnFileId = return_id;
    $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/fail-transaction-modal.html',
      controller : 'FailTransacModalCtrl',
      size : 'md',
      resolve:{
        sendFailMessage : function(){
          return $scope.sendFailMessage;
        }
      }
    })
  }
/*******************************************************/
  /*********FUNCTION IS USED TO Fail a Transaction***********/
  /*******************************************************/
    $scope.sendFailMessage = function(user){
      $scope.user = user;
      $scope.user._id = $scope.failedReturnFileId;
      $scope.user.status = "failed";
      console.log($scope.user);
      ApiCall.updateReturnFile($scope.user , function(response){
        Util.alertMessage('success',"Transaction Failed");
         $state.go('payment');
        },function(error){
          Util.alertMessage("Failed");
      })
    }


/*******************************************************/
  /*********FUNCTION IS USED TO GET Particular returnfile through fiscalyear***********/
  /*******************************************************/
  $scope.returnFileDetails = function(){
    var loggedin_user = UserModel.getUser();
    var obj = {
      fiscalYear:$scope.user.fiscalYear,
    }
    if (loggedin_user.role.type =="superAdmin")
    {
      obj.client = $stateParams.client_id;
    }
    ApiCall.getReturnFile(obj, function(response){
      $scope.returnDetails = response.data[0];
      console.log($scope.returnDetails);
      if($scope.returnDetails){
      $scope.returnDetails.total = 0;
      if($scope.returnDetails.conEmpInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.conEmpInc);
      if($scope.returnDetails.businessInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.businessInc);
      if($scope.returnDetails.capitalGainInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.capitalGainInc);
      if($scope.returnDetails.rentalInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.rentalInc);
      if($scope.returnDetails.houseLoanInterestInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.houseLoanInterestInc);
      if($scope.returnDetails.fixDepositInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.fixDepositInc);
      if($scope.returnDetails.savingAcInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.savingAcInc);
      if($scope.returnDetails.otherInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.otherInc);
      if($scope.user.total)
        $scope.returnDetails.total = $scope.user.total.toFixed(2);
    }
    },function(error){

    });
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO show RT Details to Super Admin directly from RT List***********/
  /*******************************************************/
  $scope.returnFilesDetails = function(){
    var loggedin_user = UserModel.getUser();
    var obj = {
      fiscalYear : $stateParams.fiscalYear,
      _id : $stateParams.returnFile_id
    }
    
    ApiCall.getReturnFile(obj, function(response){
      $scope.returnDetails = response.data[0];
      console.log($scope.returnDetails);
      if($scope.returnDetails){
      $scope.returnDetails.total = 0;
      if($scope.returnDetails.conEmpInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.conEmpInc);
      if($scope.returnDetails.businessInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.businessInc);
      if($scope.returnDetails.capitalGainInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.capitalGainInc);
      if($scope.returnDetails.rentalInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.rentalInc);
      if($scope.returnDetails.houseLoanInterestInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.houseLoanInterestInc);
      if($scope.returnDetails.fixDepositInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.fixDepositInc);
      if($scope.returnDetails.savingAcInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.savingAcInc);
      if($scope.returnDetails.otherInc)
        $scope.returnDetails.total = parseFloat($scope.returnDetails.total) + parseFloat($scope.returnDetails.otherInc);
      if($scope.user.total)
        $scope.returnDetails.total = $scope.user.total.toFixed(2);
    }
    },function(error){

    });
  }
  /*******************************************************/
  /*****FUNCTION IS USED TO ADD PAYMENT CONFIRMATION******/
  /*******************************************************/


  $scope.paymentConfirm = function(){
    if($scope.user.fiscalYear == "" || !$scope.user.fiscalYear) {
      delete $scope.user['fiscalYear'];
    }
    ApiCall.postTransaction($scope.user, function(response){
      console.log($scope.user);
      ApiCall.updateReturnFile($scope.user, function(response){
      console.log(response);
      },function(error){
    });
    Util.alertMessage('success',"Payment Confirmed Successfully");
     var loggedIn_user = UserModel.getUser();
      $state.go('user-profile',{'user_id':loggedIn_user._id});
    },function(error){
    });
  
  }
  $scope.getPayment = function(){

    ApiCall.getPaymentList(function(response){
      console.log(response);
     $scope.paymentList = response.data;
     $scope.paymentsList = new NgTableParams;
      $scope.paymentsList.settings({
          dataset:$scope.paymentList
      })
    },function(error){

    });

  }
  $scope.getUserDetails = function(clients_id){
    var obj ={
       "_id" : clients_id
    } 
    ApiCall.getUser(obj, function(response){
      console.log(response);
      $scope.userDetails = response.data;
    },function(error){
      console.log("error");
    });
  }
  $scope.incomeCalculation = function(){
    $scope.user.total = 0;
    if($scope.user.conEmpInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.conEmpInc);
    if($scope.user.businessInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.businessInc);
    if($scope.user.capitalGainInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.capitalGainInc);
    if($scope.user.rentalInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.rentalInc);
    if($scope.user.houseLoanInterestInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.houseLoanInterestInc);
    if($scope.user.fixDepositInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.fixDepositInc);
    if($scope.user.savingAcInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.savingAcInc);
    if($scope.user.otherInc)
      $scope.user.total = parseFloat($scope.user.total) + parseFloat($scope.user.otherInc);
    $scope.user.total = $scope.user.total.toFixed(2);
  }

});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller('FailTransacModalCtrl',function($scope, $state, $uibModalInstance,sendFailMessage){
  $scope.user = {};
  $scope.fail = function () {
    sendFailMessage($scope.user);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

   
  