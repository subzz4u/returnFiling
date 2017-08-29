app.controller('ClientController',function($scope,$rootScope,Util,$uibModal,$stateParams,NgTableParams,ClientService,ApiCall){
	
	/*FOR DIRECTOR INCREMENT STARTS HERE*/
				$scope.emp = {};	
				$scope.emp.add=[
				{
					       'name':'',
					'designation':'',
					         'id':'',
						   'pan' :'',
				    	
				}
			];	
				$scope.removeEmp=function($index){
					$scope.emp.add.splice($index,1);
					
				}
				$scope.updateEmployee = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.emp.add.push(obj);
				}
					

/*FOR DIRECTOR INCREMENT ENDS HERE*/


/*FOR SHARE HOLDERS INCREMENT startS HERE*/
				$scope.shares = {};
				$scope.shares.list=[
				{
					       'name':'',
					'designation':'',
					         'id':'',
						   'pan' :'',
				    	
				}
			];	
				$scope.removeShare=function($index){
					$scope.shares.list.splice($index,1);
					
					
				}
				$scope.newShare = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.shares.list.push(obj);
				}
	

	/*FOR SHARE HOLDERS INCREMENT ends HERE*/
	
	/*FOR SHARE Capital INCREMENT startS HERE*/
				$scope.capital = {};
				$scope.capital.list=[
				{
					       'amount':'',
						   	 'year':'',
					   
				    	
				}
			];	
				$scope.removeCapital=function($index){
					$scope.capital.list.splice($index,1);
					
					
				}
				$scope.newCapital = function(){
					var obj = {name:'' ,designation:'', id:'', pan:'' };
					$scope.capital.list.push(obj);
				}
	

	/*FOR SHARE Capital INCREMENT ends HERE*/
	
	/*Clientlist table view code starts here*/
				$scope.clientList={};
			    $scope.getClientList = function(){
			    	ApiCall.getClient(function(response){
			    		console.log(response);
			    		$scope.clientList = response.data;
			    		$scope.clientData = new NgTableParams();
			    		$scope.clientData.settings({
			    			dataset: $scope.clientList
			    		})

			    	},function(error){

			    	})	
			    }
    /*Clientlist table view code ends here*/
	
})