var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('jobCtrl');
exports.addJob = function(req,res){
  try {
    new models.jobModel(req.body).save(function (err) {
      if(err){
        logger.error("addJob ", err);
        response.sendResponse(res,500,"error",constants.messages.errors.saveRole,err);
      }
      else {
        response.sendResponse(res,200,"success",constants.messages.success.saveRole);
      }
    })

  } catch (e) {
      logger.error("addJob ", e);
  }
}
exports.getJobs = function(req,res){
try {
  var params = {
    isDelete:false,
  };
  if(req.query._id){
    params['_id'] = req.query._id;
  }
  if(req.query.category){
    params['category'] = req.query.category;
  }
  models.jobModel.find(params,function(err,data){
    if(err){
        logger.error("getJobs ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.getData,err);
    }
    return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
  })

} catch (e) {
  logger.error("getJobs ", e);
}
}
exports.udpateRole = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.jobModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      response.sendResponse(res,200,"success",constants.messages.success.udpateRole,data);
    })
    .catch(function(err) {
      logger.error("udpateRole ", err);
      response.sendResponse(500,"error",constants.messages.error.udpateRole,err);
    })

  } catch (e) {
    logger.error("udpateRole ", e);
  }
}
exports.deleteRole = function(req,res){
  try {

    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.jobModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("deleteRole ", err);
        response.sendResponse(res,500,"error",constants.messages.errors.deleteRole,err);
      }
      else
      response.sendResponse(res,200,"success",constants.messages.success.deleteRole);
    })
  } catch (e) {
    logger.error("deleteRole ", err);
  }
}
