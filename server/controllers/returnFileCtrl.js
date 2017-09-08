var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var utility = require("./../component/utility");
var models = require("./../models/index");
var constants = require("./../../config/constants");

exports.addReturnFile = function(req, res) {

  models.userModel.findOne({
    _id: req.body.client
  }, function(err, client) {
    if (err)
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    else {
      // produce itrId key
      if (!req.body.itrId)
        req.body.itrId = client.email + "_" + req.body.fiscalYear;
      // saving return files
      new models.returnFileModel(req.body).save(function(err) {
        if (err)
          response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
        else {

          response.sendResponse(res, 200, "success", constants.messages.success.saveData);
        }
      })
    }
  })

}
exports.getReturnFile = function(req, res) {
   var params = {
       isDelete: false
   };
   if (req.query._id) {
       params['_id'] = req.query._id
   }
   if (req.query.status) {
       params['status'] = req.query.status;
   }
   if (req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
   {
       params['client'] = req.user._doc._id;
   }
// make fileter with fiscal year
if (req.query.fiscalYear)
   {
       params['fiscalYear'] = req.query.fiscalYear;
   }
   models.returnFileModel.find(params)
       //.populate('client')
       .exec()
       .then(function(data) {
           return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
       })
       .catch(function(err) {
           return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
       })
}
exports.getItr = function(req, res) {
  var params = {
    isDelete: false
  };

  if(req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
  {
    params['client'] = req.user._doc._id;
  }
  else{
    return response.sendResponse(res, 401, "error", constants.messages.errors.invalidUser);
  }
  models.returnFileModel.find(params).select('itrId fiscalYear')
    //.populate('client')
    .exec()
    .then(function(data) {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })
    .catch(function(err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    })
}
exports.getfiscalYear = function(req, res) {
  var params = {
    isDelete: false
  };
  models.returnFileModel.find(params).distinct('fiscalYear',function(err,data){
    if(err){
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    }
    else{
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    }
  })
}
exports.getReturnFileCounts = function(req, res) {


  models.returnFileModel.aggregate([{
    $group: {
      "_id": {
        "status": "$status",
      },
      "count": {
        "$sum": 1
      }
    }
  }], function(err, result) {
    response.sendResponse(res, 200, "success", constants.messages.success.saveData, result);
  })



}
exports.udpateReturnFile = function(req, res) {
  var query = {
    "_id": req.body._id
  }
  delete req.body['_id'];
  var options = {
    new: true
  };
  models.returnFileModel.findOneAndUpdate(query, req.body, options).exec()
    .then(function(data) {
      response.sendResponse(res, 200, "success", constants.messages.success.saveData, data);
    })
    .catch(function(err) {
      response.sendResponse(500, "error", constants.messages.error.saveData, err);
    })
}
exports.deleteReturnFile = function(req, res) {
  var query = {
    "_id": req.params.id
  }
  delete req.body['_id'];
  models.returnFileModel.findOneAndUpdate(query, {
    "isDelete": true
  }, {
    "new": true
  }, function(err, data) {
    if (err)
      response.sendResponse(res, 500, "error", constants.messages.errors.deleteRole, err);
    else
      response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
  })
}


// transaction services
exports.saveTransaction = function(req,res) {
  //validation starts

  var query = {
    "_id": req.body._id
  }
  delete req.body['_id'];
  var update = req.body;
  var options = {
    "new": true
  };
  models.returnFileModel.findOneAndUpdate(query, update ,options, function(err, data) {
    if (err)
      response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
    else
      response.sendResponse(res, 200, "success", constants.messages.success.saveData);
  })

}
