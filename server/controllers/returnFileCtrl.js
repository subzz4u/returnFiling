var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var component = require("./../component/index");
var models = require("./../models/index");
var constants = require("./../../config/constants");

exports.addReturnFile = function(req, res) {

  models.userModel.findOne({
    _id: req.body.client
  }, function(err, client) {
    if (err){
      console.log("err 1");
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    }
    else {
      req.body.form16 = req.body.formXvi; // overriding formXvi, for now
      // produce itrId key
      req.body.itrId = getItrId(client.mobile,req.body.fiscalYear,"_");//client.email + "_" + req.body.fiscalYear;
      // saving return files
      // checking for form16 file for upload
      uploadForm16(req.body.form16,function(err,form16) {
        if(err){
          return response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
        }
        req.body.form16 = form16; // image path
        new models.returnFileModel(req.body).save(function(err,returnFile) {
          if (err){
            console.log("err 2" ,err);
            response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
          }
          else {
            // saving reference details
            if(req.body.referralEmail || req.body.referralMobile) {
              var obj = {
                returnFile : returnFile,
                referralEmail : req.body.referralEmail,
                referralMobile : req.body.referralMobile
              }
              console.log("saving referral details  ",obj);
              new models.referralModel(obj).save(function(err,referral) {
                if (err)
                console.log("error in referral save " , err);
                else
                console.log("referral saved for the returnfile " , returnFile._id)
              })
            }
            response.sendResponse(res, 200, "success", constants.messages.success.saveData);
          }
        })
      })
    }
  })

}
function getItrId(mobile,fiscalYear,separator) {
	fiscalYear = fiscalYear.split("-");
	return mobile+separator+fiscalYear[0].substr(2)+separator+fiscalYear[1].substr(2)

}
function uploadForm16(imageData,callback){
  if(!imageData || !imageData.fileName || !imageData.base64){
    callback(null,null);
  }
  else{
    // upload base 64 file
    component.utility.uploadImage(imageData,function(err,imagePath){
      if(err){
        callback(err,null);
      }
      else{

        callback(null,imagePath);
      }
    })
  }
}
exports.getReturnFile = function(req, res) {
  var params = {
    isDelete: false
  };
  if (req.query._id) {
    params['_id'] = req.query._id;
  }
  if (req.query.status) {
    params['status'] = req.query.status;
  }
  if (req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
  {
    params['client'] = req.user._doc._id;
  }
  if (req.query.client) // send only those return files that are posted by the client only
  {
    params['client'] = req.query.client;
  }
  // make fileter with fiscal year
  if (req.query.fiscalYear) {
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

  if (req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
  {
    params['client'] = req.user._doc._id;
  }
  if (req.query.client) {
    params['client'] = req.query.client;
  }
  // else {
  //   return response.sendResponse(res, 401, "error", constants.messages.errors.invalidUser);
  // }
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
exports.getReferral = function(req, res) {
  var params = {
    isDelete: false
  };
  if(req.query.count == "true") {
    models.referralModel.count({}, function(err, count){
        return response.sendResponse(res, 200, "success", constants.messages.success.getData, count);
    });
  }
  else{

    models.referralModel.find(params)
    //.populate('client')
    .exec()
    .then(function(data) {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })
    .catch(function(err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    })
  }
}
exports.getfiscalYear = function(req, res) {
  var params = {
    isDelete: false,
     client: req.query.client
  };
  // var query = {
  //   "client": req.body._id
  // }
  models.returnFileModel.find(params).distinct('fiscalYear', function(err, data) {
    if (err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    } else {
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
    return response.sendResponse(res, 200, "success", constants.messages.success.saveData, result);
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
      return response.sendResponse(res, 200, "success", constants.messages.success.saveData, data);
    })
    .catch(function(err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
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
      return response.sendResponse(res, 500, "error", constants.messages.errors.deleteRole, err);
    else
      return response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
  })
}


// transaction services
exports.saveTransaction = function(req, res) {
  //validation starts

  var query = {
    "itrId": req.body.itrId
  }
  delete req.body['_id'];
  var update = req.body;
  var options = {
    "new": true
  };
  models.returnFileModel.findOneAndUpdate(query, update, options, function(err, data) {
    if (err)
      return response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
    else
      return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
  })

}

exports.getPaymentList = function(req, res) {
  //component.utility.validateNull(req,res,'query','val');
  var params = {
    isDelete: false
  };
  if (req.query.itrId) {
    params['itrId'] = req.query.itrId;
  }
  // if (req.query.status) {
  //     params['status'] = req.query.status;
  // }
  if (req.query.tranId) {
    params['tranId'] = req.query.tranId;
  }
  // filter result based on user role
  var filter = {};
  if (req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
  {
    filter.client = req.user._doc._id;
  }
  models.returnFileModel.find(params)
    .select('itrId fiscalYear client tranId tranAmt status tranStatus tranVerification')
    .where(filter)
    //.populate('client')
    .exec()
    .then(function(data) {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })
    .catch(function(err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    })
}
exports.getTransaction = function(req, res) {
  //validation starts

  var filter = {};
  if (req.user._doc.role.type == 'client') // send only those return files that are posted by the client only
  {
    filter.client = req.user._doc._id;
  }
  models.returnFileModel.find({})
    .select("tranId tranAmt tranStatus tranVerification")
    .where(filter)
    .exec()
    .then(function(transactions) {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, transactions);
    })
    .catch(function(err) {
      return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
    })
}
exports.updateTransactionStatus = function(req, res) {
  //validation starts
  component.utility.validateNull(req,res,"body","_id","tranVerification");
  var query = {
    _id:req.body._id
  },
  update = {
    tranVerification : req.body.tranVerification
  }
  option = {
    new:true
  }
  if(req.body.tranVerification == "closed"){
    update.status = "processing"
  }

  models.returnFileModel.findOneAndUpdate(query,update,option,function(err,transaction) {
    if(err)
    {
      return response.sendResponse(res, 500, "error", constants.messages.errors.saveData);
    }
    else {
      return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
    }
  })
  // return response.sendResponse(res, 200, "success", constants.messages.success.getData, transactions);

}
