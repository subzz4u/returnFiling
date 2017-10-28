var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('templateCtrl');
exports.addTemplate = function(req,res){
  try {
    new models.templateModel(req.body).save(function (err) {
      if(err){
        logger.error("addTemplate ", err);
        response.sendResponse(res,500,"error",constants.messages.errors.saveData,err);
      }
      else {
        response.sendResponse(res,200,"success",constants.messages.success.saveData);
      }
    })

  } catch (e) {
    logger.error("addTemplate ", e);
  }
}
exports.getTemplate = function(req,res){
  try {
    var params = {
      isDelete:false
    };
    console.log("req.query.id   "+req.query._id);
    if(req.query._id){
      params['_id'] = req.query._id
    }

    models.templateModel.find(params,function(err,data){
      if(err){
        logger.error("getTemplate ", err);
        response.sendResponse(res,500,"success",constants.messages.errors.getData,err);
      }
      response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })

  } catch (e) {
    logger.error("getTemplate ", e);
  }
}
exports.udpateTemplate = function(req,res){
  try {
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
      logger.error("udpateTemplate ", err);
      response.sendResponse(500,"error",constants.messages.error.udpateData,err);
    })

  } catch (e) {
    logger.error("udpateTemplate ", e);
  }
}
exports.deleteTemplate = function(req,res){
  try {
    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.templateModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("udpateTemplate ", err);
        response.sendResponse(res,500,"error",constants.messages.errors.deleteData,err);
      }
      else
      response.sendResponse(res,200,"success",constants.messages.success.deleteData);
    })

  } catch (e) {
    logger.error("udpateTemplate ", e);
  }
}
