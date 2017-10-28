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
var logger = require("./../component/log4j").getLogger('jobAssignmentCtrl');
exports.addJobAssignment = function(req, res) {
  // add validation
  try {

    var result = component.utility.validateNull(req, res, 'body', "category", "assignment", "description", "workName");
    if (result) {
      return; // error response already sent
    } else {
      console.log("$$$$$$$", result);

    }
    new models.jobAssignmentModel(req.body).save(function(err) {
      if (err) {
        logger.error("addJobAssignment ", e);
        response.sendResponse(res, 500, "error", constants.messages.errors.saveRole, err);
      } else {
        response.sendResponse(res, 200, "success", constants.messages.success.saveRole);
      }
    })
  } catch (e) {
    logger.error("addJobAssignment ", e);
  }
}
exports.getJobAssignments = function(req, res) {
  try {
    var params = {
      isDelete: false,
    };
    if (req.query._id) {
      params['_id'] = req.query._id;
    }
    if (req.query.category) {
      params['category'] = req.query.category;
    }
    if (req.query.user) {
      params['user'] = req.query.user;
    }
    if (req.query.status) {
      params['status'] = req.query.status;
    }
    if (req.query.createdFor) {
      params['createdFor'] = req.query.createdFor;
    }
    models.jobAssignmentModel.find(params, function(err, data) {
      if (err) {
        logger.error("getJobAssignments ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })

  } catch (e) {
    logger.error("getJobAssignments ", e);
  }
}
exports.getAssignmentCounts = function(req, res) {
  try {

    var query = {};
    if (req.user._doc.role.type != "superAdmin") {
      query.user = req.user._doc._id
    }
    models.jobAssignmentModel.count(query, function(err, count) {
      if (err) {
        logger.error("getAssignmentCounts ", err);
        return response.sendResponse(res, 500, "error", constants.messages.errors.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, count);
    })
  } catch (e) {
    logger.error("getAssignmentCounts ", err);
  }

}
exports.udpateJobAssignment = function(req, res) {
  try {
    var query = {
      "_id": req.body._id
    }
    delete req.body['_id'];
    var options = {
      new: true
    };
    // user validation
    if (req.user._doc.role.type != "superAdmin") {
      query.user = req.user._doc._id
    }
    models.jobAssignmentModel.findOneAndUpdate(query, req.body, options).exec()
    .then(function(data) {
      if (!data) {
        response.sendResponse(res, 402, "error", constants.messages.errors.userUnAuthorised);
      } else {
        response.sendResponse(res, 200, "success", constants.messages.success.saveJob, data);
      }

    })
    .catch(function(err) {
      response.sendResponse(res, 500, "error", constants.messages.errors.saveJob, err);
    })

  } catch (e) {
    logger.error("udpateJobAssignment ", e);
  }
}
exports.deleteRole = function(req, res) {
  try {
    var query = {
      "_id": req.params.id
    }
    delete req.body['_id'];
    models.jobModel.findOneAndUpdate(query, {
      "isDelete": true
    }, {
      "new": true
    }, function(err, data) {
      if (err){
        logger.error("deleteRole ", err);
        response.sendResponse(res, 500, "error", constants.messages.errors.deleteRole, err);
      }
      else
        response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
    })

  } catch (e) {
    logger.error("deleteRole ", e);
  }
}
