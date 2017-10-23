app.controller("Referral_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){
	$scope.user = {};
  $scope.dashboard = {};
	$scope.getReferralCount = function() {
    var obj = {
      count:true
    }
    ApiCall.getReferral(obj,function(response){
      $scope.dashboard.referralCount = response.data;
      },function(error){
        console.log(error);
      })
  }
   $scope.referralList = function(){
   ApiCall.getReferralList(function(response){
    $scope.referList = response.data;
    $scope.listData = new NgTableParams;
    $scope.listData.settings({
      dataset:$scope.referList
    })
   },function(error){
     console.log("error");
   });
  }
  $scope.referralOverviewList = function(){
    ApiCall.getOverview(function(response){
      console.log(response);
      console.log(2547823623);
    },function(error){

    });
  }

});