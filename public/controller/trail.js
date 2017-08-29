app.controller('TrailController',function($scope,$http,$rootScope,Util,$uibModal,$stateParams){
	$scope.trail = {};	
	$scope.selectedFiles = null;
	 $scope.msg = "";  
	$scope.read= function(workbook){
		console.log(JSON.stringify(workbook));
	} 
})