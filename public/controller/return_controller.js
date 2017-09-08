app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel){
  $scope.user = {};
  $scope.active_tab1 = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  $scope.active_tab = 'year';
  $scope.user.fiscalYear = '';

  $scope.tabChange = function(tab){
    $scope.active_tab = tab;
  }
  $scope.tabChangeDetails = function(tab){
    $scope.active_tab1 = tab;
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
      Util.alertMessage('danger',error.data.message);
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
      $scope.itrIdList  = response.data;
    },function(error){

    })
  }
 /*******************************************************/
  /*********FUNCTION IS USED TO GET Particular returnfile through fiscalyear***********/
  /*******************************************************/
  $scope.returnFileDetails = function(){
    var obj = {
      fiscalYear:$scope.user.fiscalYear
    }
    ApiCall.getReturnFile(obj, function(response){
      $scope.returnDetails = response.data[0];
      console.log($scope.returnDetails);
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
      $scope.returnDetails.total = $scope.user.total.toFixed(2);
    },function(error){

    });
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
