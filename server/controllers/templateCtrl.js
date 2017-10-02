var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");

exports.addTemplate = function(req,res){
  new models.templateModel(req.body).save(function (err) {
    if(err)
      response.sendResponse(res,500,"error",constants.messages.errors.saveData,err);
      else {
        response.sendResponse(res,200,"success",constants.messages.success.saveData);
      }
  })
}
exports.getTemplate = function(req,res){
  var params = {
    isDelete:false
  };
  console.log("req.query.id   "+req.query._id);
  if(req.query._id){
    params['_id'] = req.query._id
  }

  models.templateModel.find(params,function(err,data){
    response.sendResponse(res,200,"success",constants.messages.success.getData,data);
  })
}
exports.udpateTemplate = function(req,res){
  var query = {
    "_id":req.body._id
  }
  delete req.body['_id'];
  delete req.body['header'];
  var options = {new:true};
  models.templateModel.findOneAndUpdate(query, req.body,options).exec()
  .then(function(data) {
    response.sendResponse(res,200,"success",constants.messages.success.udpateData,data);
  })
  .catch(function(err) {
    response.sendResponse(500,"error",constants.messages.error.udpateData,err);
  })
}
exports.deleteTemplate = function(req,res){
  var query = {
    "_id":req.params.id
  }
  delete req.body['_id'];
  models.templateModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
    if(err)
      response.sendResponse(res,500,"error",constants.messages.errors.deleteData,err);
    else
      response.sendResponse(res,200,"success",constants.messages.success.deleteData);
  })
}
