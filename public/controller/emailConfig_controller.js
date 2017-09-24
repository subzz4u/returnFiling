app.controller("EmailConfig_Controller",function($scope,$timeout,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){
  var templates = [

    {
      _id:1,
      header:"template1",
      content:"content 1"
    },
    {
      _id:2,
      header:"template2",
      content:"content 2"
    },
    {
      _id:3,
      header:"template3",
      content:"content 3"
    },
  ]
  $scope.templateList = new NgTableParams;
  $scope.templateList.settings({
    dataset: templates
  })

  // $scope.getEmailTemplates = function(){
  //   ApiCall.getUser(function(response){
  //     $scope.users.nos = response.data.length;
  //     $scope.userList = response.data;
  //     $scope.userData = new NgTableParams;
  //     $scope.userData.settings({
  //       dataset: $scope.userList
  //     })
  //     },function(error){
  //       console.log("Error "+error);
  //     })
  // }

  $scope.getTemplateDetails = function(){
     $scope.template = $stateParams.data;
     $("#txtEditor").Editor();  
  }

});
