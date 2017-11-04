var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('referralCtrl');
exports.getReferral = function(req,res) {
  try {
    var param = {};
    if(req.user._doc.role.type != "superAdmin"){
      param.referredBy = req.user._doc._id;
    }
    if (req.query.referredBy) {
      param['referredBy'] = req.query.referredBy;
    }
    models.referralModel.find(param).populate("returnFile","itrId tranStatus status tranVerification fileDate client")
    .exec()
    .then(function(referral) {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData,referral);
    })
    .catch(function(error) {
      logger.error("getReferral ", error);
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData,error);
    })

  } catch (e) {
    logger.error("getReferral ", e);
  }
}
exports.getReferralCount = function(req, res) {
  try {
    var params = {
      isDelete: false
    };
    if(req.user._doc.role.type!="superAdmin"){
      params['referredBy'] = req.user._doc._id;
    }
    models.referralModel.count(params, function(err, count){
      if(err){
        logger.error("getReferralCount ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, count);
    });

  } catch (e) {
    logger.error("getReferralCount ", err);
  }
}
exports.getOverView = function(req, res) {
  try {
    var aggregate = [
      {
        $group: {
          _id: '$referralEmail',
          referredBy : { $first: '$referredBy' },
          referralMobile : { $first: '$referralMobile' },
          count: {$sum: 1}
        }
      }
    ]
    models.referralModel.aggregate(aggregate,function(err,data) {
       console.log(data);
      if(err){
        logger.error("getOverView ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
      }
      else{
        console.log(data);
        return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
      }
    })
  } catch (e) {
    logger.error("getOverView ", e);
  }
}
