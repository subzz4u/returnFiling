var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var component = require("./../component/index");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var config = require("config");
var logger = require("./../component/log4j").getLogger('referFriendCtrl');
var LOG = require("./../component/LOG");
exports.addReferredFriend = function(req,res){
  try {
    if(!req.user) {
      logger.error("addReferredFriend ", constants.messages.errors.referredByInvalid);
      return response.sendResponse(res,402,"error",constants.messages.errors.referredByInvalid);
    }
    component.utility.validateNull(req,res,"body","email","name");
    // inject referred user id
    req.body['referredBy'] = req.user._doc._id;
    new models.referFriendModel(req.body).save(function (err) {
      if(err){
        logger.error("addReferredFriend ", err);
        return response.sendResponse(res,500,"error",constants.messages.errors.saveData,err);

      }
      else {

        // sending verification mail to user
        var data = {
          templateType: "refer_friend",
          email: req.body.email,
          mobile: req.body.mobile,
          name: req.body.name,
          referredBy:req.user._doc.firstName && req.user._doc.lastName ? req.user._doc.firstName + " "+ req.user._doc.lastName : req.user._doc.email.split("@")[0],
          signUpUrl:config.get(config.get("env")+".baseUrl")+config.get("routes").signup,
          company: constants.companyDetails.name,

        }
        component.utility.sendVerificationMail(data, function(err, success) {
          if (err) {
            LOG.error("mail error send  error"+err);
            logger.error("addReferredFriend  "+err);
            // return response.sendResponse(res, 500, "error", constants.messages.errors.forgetPasswordFailed, err);
          } else {
            LOG.info("mail error send  success");
            // return response.sendResponse(res, 200, "success", constants.messages.success.verificationMailSent);
          }
        })
        return response.sendResponse(res,200,"success",constants.messages.success.saveData);
      }
    })

  } catch (e) {
    logger.error("addReferredFriend ", e);
  }
}
exports.getReferredFriend = function(req,res){
  try {
    var params = {
      isDelete:false,
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    // check for the user specific result
    if(req.user._doc.role.type != "superAdmin") {
      params['referredBy'] = req.user._doc._id;
    }
    models.referFriendModel.find(params).populate("referredBy","email firstName lastName")
    .exec()
    .then(function(data){
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })
    .catch(function(err) {
      logger.error("getReferredFriend ", err);
      return response.sendResponse(res,500,"error",constants.messages.errors.getData,err);
    })


  } catch (e) {
    logger.error("getReferredFriend ", e);
  }
}
exports.udpateReferredFriend = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.referFriendModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      response.sendResponse(res,200,"success",constants.messages.success.udpateRole,data);
    })
    .catch(function(err) {
      logger.error("udpateReferredFriend ", err);
      response.sendResponse(res, 500,"error",constants.messages.error.udpateRole,err);
    })

  } catch (e) {
    logger.error("udpateReferredFriend ", e);
  }
}
exports.deleteReferredFriend = function(req,res){
  try {
    var query = {
      "_id":req.params.id
    }
    delete req.body['_id'];
    models.referFriendModel.findOneAndUpdate(query,{"isDelete":true},{"new" :true},function(err,data) {
      if(err){
        logger.error("deleteReferredFriend ", err);
        response.sendResponse(res,500,"error",constants.messages.errors.deleteRole,err);
      }
      else
      response.sendResponse(res,200,"success",constants.messages.success.deleteRole);
    })

  } catch (e) {
    logger.error("deleteReferredFriend ", e);
  }
}
