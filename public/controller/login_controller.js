	app.controller('LoginCtrl',function($scope,$rootScope,LoginService,$state,$window,$localStorage,UserModel, ApiCall, $timeout){
	$scope.user = {};
	$scope.userLogin = function(){
		$rootScope.showPreloader = true;
		ApiCall.userLogin($scope.user, function(response){
			$rootScope.showPreloader = false;
			$rootScope.is_loggedin = true;
		 	$localStorage.token = response.data.token;
			//UserModel.setUser(response.data.user);
			// 	$scope.$emit("Login_success");
			console.log("login success");
			$timeout(function() {
				$state.go('dashboard');
			},500);
		},function(error){
			$rootScope.showPreloader = false;
			$rootScope.is_loggedin = false;
		})
	}
})
