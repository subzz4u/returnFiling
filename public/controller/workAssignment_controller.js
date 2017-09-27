app.controller("Work_Assignment_Controller",function($scope,$rootScope,$rootScope,$state,$localStorage,NgTableParams,ApiCall, $timeout){
	$scope.user = {};
	$scope.paymentConfirm = function(){
		ApiCall.postTransaction($scope.user , function(response){
			console.log("posted");

		},function(error){

		});
	}
});