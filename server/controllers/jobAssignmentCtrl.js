var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var component = require("./../component/index");

exports.addJobAssignment = function(req,res){
  // add validation
  var result = component.utility.validateNull(req,res,'body',"category","assignment","description","role","user","startDate","endDate");
  if(result)
  {
    return ; // error response already sent
  }
  else{
    console.log("$$$$$$$",result);

  }
  new models.jobAssignmentModel(req.body).save(function (err) {
    if(err)
      response.sendResponse(res,500,"error",constants.messages.errors.saveRole,err);
      else {
        response.sendResponse(res,200,"success",constants.messages.success.saveRole);
      }
  })
}
exports.getJobAssignments = function(req,res){

  var params = {
    isDelete:false,
  };
  if(req.query._id){
    params['_id'] = req.query._id;
  }
  if(req.query.category){
    params['category'] = req.query.category;
  }
  if(req.query.user){
    params['user'] = req.query.user;
  }
  models.jobAssignmentModel.find(params,function(err,data){
    response.sendResponse(res,200,"success",constants.messages.success.getData,data);
  })
}
exports.udpateJobAssignment = function(req,res){
  var query = {
    "_id":req.body._id
  }
  delete req.body['_id'];
  var options = {new:true};
  models.jobAssignmentModel.findOneAndUpdate(query, req.body,options).exec()
  .then(function(data) {
    response.sendResponse(res,200,"success",constants.messages.success.saveJob,data);
  })
  .catch(function(err) {
    response.sendResponse(res,500,"error",constants.messages.errors.saveJob,err);
  })
}
exports.deleteRole = function(req,res){
  var query = {
    "_id":req.params.id
  }
  delete req.body['_id'];
  models.jobModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
    if(err)
      response.sendResponse(res,500,"error",constants.messages.errors.deleteRole,err);
    else
      response.sendResponse(res,200,"success",constants.messages.success.deleteRole);
  })
}
