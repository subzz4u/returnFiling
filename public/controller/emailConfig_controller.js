app.controller("EmailConfig_Controller",function($scope,$timeout,$rootScope,$state,$localStorage,NgTableParams,ApiCall,UserModel,Util,$stateParams){

  $scope.initTemplate = function() {
    $scope.template = {};
    $scope.disabled = false;
    if($stateParams._id){
        $scope.getTemplates($stateParams._id);
        $scope.template.isReadOnly = true;
    }
    else {
      $scope.orightml="";
      $scope.htmlcontent = $scope.orightml;
      $scope.template.isReadOnly = false;
    }
  }
  $scope.getTemplates = function(_id){
    var obj = {};
    if(_id){
      obj._id = _id;
    }
    ApiCall.getTemplate(obj,function(response) {
      if(_id){
        $scope.template = response.data[0];
      }
      else{
        $scope.templateList = new NgTableParams;
        $scope.templateList.settings({
          dataset: response.data
        })
      }
    }, function(error) {
      console.log("Error in fetching templates ",error);
    })
  }

  //
  // var templates = [
  //
  //   {
  //     _id:1,
  //     header:"template1",
  //     content:"content 1"
  //   },
  //   {
  //     _id:2,
  //     header:"template2",
  //     content:"content 2"
  //   },
  //   {
  //     _id:3,
  //     header:"template3",
  //     content:"content 3"
  //   },
  // ]
  // $scope.templateList = new NgTableParams;
  // $scope.templateList.settings({
  //   dataset: templates
  // })

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

  $scope.updateTemplate = function(){
     console.log($scope.htmlcontent);
     if($stateParams._id) {
       // update
       ApiCall.putTemplate($scope.template,function(response) {
         Util.alertMessage('success',response.message);
         $state.go("emailConfig");
       }, function(error) {
         Util.alertMessage('error',response.message);
       })
     }
     else {
       // new template
       ApiCall.postTemplate($scope.template,function(response) {
         Util.alertMessage('success',response.message);
         $state.go("emailConfig");
       }, function(error) {
         Util.alertMessage('error',response.message);
       })
     }
  }

});
