app.controller("Return_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,Util, $timeout,UserModel){
  $scope.user = {};
  $scope.active_tab1 = 'income';
  $scope.list  = {};
  $scope.itrIdList = {};
  $scope.yearList = {};
  $scope.active_tab = 'year';

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
    console.log($scope.user.fiscalYear);
    var obj = {
      fiscalYear:$scope.user.fiscalYear
    }
    ApiCall.getReturnFile(obj, function(response){
      $scope.user = response.data;
      console.log($scope.user);
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
});
