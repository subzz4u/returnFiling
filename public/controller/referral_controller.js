app.controller("Referral_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout,$stateParams){
	$scope.overviewList = {};
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
    var obj = {};
    if($state.current.name == "referral-list"){
      obj.referredBy = $stateParams.referal_id;
    }
   ApiCall.getReferralList(obj, function(response){
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
      $scope.overviewList = response.data;
      $scope.listOverview = new NgTableParams;
      $scope.listOverview.settings({
        dataset:$scope.overviewList
     })  
    },function(error){

    });
  }

});