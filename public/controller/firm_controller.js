app.controller('FirmController',function($scope,$rootScope,Util,$uibModal,$stateParams,ApiCall,$state,UserModel){
	
	$scope.partners = {};	
	$scope.partners.list = [
  	{
  		'name':'',
  		'designation':'',
  		'membership':'',
  	}
	];	
	$scope.removePart = function($index){
		$scope.partners.list.splice($index,1);
		
	}
	$scope.updatePart = function(){
		var obj = {name:'' ,designation:'', membership:'' };
		$scope.partners.list.push(obj);
	}
	$scope.getRoleList = function(){
     ApiCall.getRole(function(response){
      $scope.roleList = response.data;
     },function(error){

     })
  }
  $scope.caFirmRegister = function(){
  	ApiCall.postUser($scope.caFirm, function(response){
      if(response.statusCode == 200)
  		  Util.alertMessage('success',response.message);
  	},function(error){

  	})
  }
  $scope.updateCaFirm = function(){
  	$scope.caFirm.admin = UserModel.getUser()._id;
    $scope.caFirm.Partners = $scope.partners.list;
  	ApiCall.postCaFirm($scope.caFirm, function(response){
  		if(response.statusCode == 200){
        Util.alertMessage('success',response.message);
  		  $state.go('ca-firm');
      }
  	},function(error){

  	})
  }
  $scope.data = {};
  $scope.getCaFirmDetails = function(){
  	$scope.data = UserModel.getUser();
    	var obj = {
      "_id":"599823699345e92a141e2cba"
    }
    ApiCall.getCaFirm( function(response){
      console.log(response);

    },function(error){

    })

	}
})