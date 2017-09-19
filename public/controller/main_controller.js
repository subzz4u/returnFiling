/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller("Main_Controller",function($scope,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,$uibModal,$stateParams,Util,$timeout){
  $scope.userList = {};
  $scope.count = {};
  $scope.users = {};
  /*******************************************************/
  /*********FUNCTION IS USED TO SIGN OUT PROFILE**********/
  /*******************************************************/
  $scope.signOut = function(){
    delete $localStorage.token;
    $rootScope.is_loggedin = false;
    $state.go('login');
  }

  /*******************************************************/
  /*********FUNCTION IS USED TO GET USER LIST*************/
  /*******************************************************/
  $scope.getAllUsers = function(){
    ApiCall.getUser(function(response){
      $scope.users.nos = response.data.length;
      $scope.userList = response.data;
      $scope.userData = new NgTableParams;
      $scope.userData.settings({
        dataset: $scope.userList
      })
      },function(error){
      })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO CHECK ADMIN USER**********/
  /*******************************************************/
  $scope.checkAdmin = function(){
    $scope.superAdmin = false;
      var loggedIn_user = UserModel.getUser();
      if(loggedIn_user.role.type == "superAdmin"){
        $scope.superAdmin = true;
      }
      else{
        $scope.superAdmin = false;
      }
      return  $scope.superAdmin;
  }
  /*******************************************************/
  /******FUNCTION IS USED TO OPEN DELETE USER MODAL*******/
  /*******************************************************/
  $scope.deleteUser = function(data){
   $scope.deleteUserId = data._id;
   $scope.modalInstance = $uibModal.open({
      animation : true,
      templateUrl : 'view/modals/user-delete-modal.html',
      controller : 'daleteUserModalCtrl',
      size: 'md',
      resolve:{
        userDelete : function(){
           return $scope.userDelete;
        }
      }
   })
  }
  /*******************************************************/
  /*********FUNCTION IS USED TO DELETE USER***************/
  /*******************************************************/
  $scope.userDelete = function(){
    ApiCall.deleteUser({
      _id: $scope.deleteUserId
    }, function(res) {
      Util.alertMessage('success', res.message);
      $scope.getAllUsers();
    }, function(error) {
    })
  }
  /*******************************************************/
  /******FUNCTION IS USED TO GET RETURN FILE COUNT********/
  /*******************************************************/
  $scope.getReturnCount = function(){
    ApiCall.getcount(function(response){
     $scope.returnFilesCounts = response.data;
     console.log(response);
    },function(error){
    })
  }
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller('daleteUserModalCtrl',function($scope, $uibModalInstance,userDelete){
  $scope.ok = function () {
    userDelete();
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
app.controller('DatePickerCtrl' , ['$scope', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        /*
         $scope.disabled = function(date, mode) {
         return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
         };*/

        $scope.toggleMin = function() {
            $scope.minDate = null; //$scope.minDate = null || new Date();
            $scope.maxDate = new Date();
            $scope.dateMin = null || new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.mode = 'month';

        $scope.initDate = new Date();
        $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
        $scope.format = $scope.formats[4];
        $scope.format1 = $scope.formats[5];

    }
]);

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
