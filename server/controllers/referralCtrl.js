var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");

exports.getReferral = function(req,res) {
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
    return response.sendResponse(res, 500, "error", constants.messages.errors.getData,error);
  })
}
exports.getReferralCount = function(req, res) {
  var params = {
    isDelete: false
  };
  if(req.user._doc.role.type!="superAdmin"){
    params['referredBy'] = req.user._doc._id;
  }
  models.referralModel.count(params, function(err, count){
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, count);
  });
}
exports.getOverView = function(req, res) {
  var aggregate = [
        {
            $group: {
               _id: '$referredBy',
                count: {$sum: 1}
           }
       }
     ]
  models.referralModel.aggregate(aggregate,function(err,data) {
    if(err){
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    }
    else{
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    }
  })
}
