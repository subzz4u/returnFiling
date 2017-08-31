var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var LOG = require('./../component/LOG');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var userModel = require("./../models/userModel");
var password = require('password-hash-and-salt');
var jwt = require('jsonwebtoken');
var config = require('config');
var validator = require('validator');
var component = require('./../component/index');
var models = require('./../models/index');
var waterfall = require('async-waterfall');
// var async = require('async');
var utility = require('./../component/utility');
/*
 * this will be executed if authentication passes
 */
exports.verifiedUser = function(req, res, isError) {
  console.log("verified in ctrl");
  if (!isError) {
    response.sendResponse(res, 200, "success", constants.messages.success.verified);
  } else {
    console.log(isError);
    response.sendResponse(res, 200, "success", constants.messages.error.verified);
  }
}
exports.login = function(req, res) {
  // creating token that will send to the client side
  try {
    var token = jwt.sign(req.user, config.token.secret, {
        expiresIn: config.token.expiry
      },
      function(token) {
        var data = {
          //user:req.user,
          token: token
        }
        response.sendResponse(res, 200, "success", constants.messages.success.login, data);
      });
  } catch (e) {
    LOG.error(e);
    response.sendResponse(res, 500, "error", constants.messages.errors.login, e);
  }
}
exports.addUser = function(req, res) {
  LOG.info("add user");
  // cheking validation
  if (component.utility.isEmpty(req.body.username) ||
    component.utility.isEmpty(req.body.password) ||
    component.utility.isEmpty(req.body.email) ||
    component.utility.isEmpty(req.body.role)
  ) {
    return response.sendResponse(res, 400, "error", constants.statusCode['400']);
  }
  // caFirm check for the level 3 users like S.Auditor , auditor etc
  models.roleModel.findById(req.body.role)
    .then(function(role) {
      console.log(role + ">>>>>");
      if (!role) {
        return response.sendResponse(res, 400, "error", constants.statusCode['400']);
      }
      password(req.body.password).hash(function(error, hash) {
        req.body.password = hash; // encrypting the password
        new userModel(req.body).save(function(err, user) {
          if (err) {
            LOG.error(err.message);
            return response.sendResponse(res, 500, "error", constants.messages.errors.saveUser, err);
          } else {
            //response.sendResponse(res, 200, "success", constants.messages.success.saveUser);
            LOG.info("User saved !!!!");
            // sending email verification
            var data = {
              type: "signUp",
              email: user.email,
              name: user.username,
            }
            utility.sendVerificationMail(data, function(err, success) {
              if (err) {
                // console.log("mail error send  ");
                return response.sendResponse(res, 500, "error", constants.messages.errors.forgetPasswordFailed, err);
              } else {
                return response.sendResponse(res, 200, "success", constants.messages.success.verificationMailSent);
              }
            })
          }
        })
      })
    })
    .catch(function(err) {
      response.sendResponse(res, 500, "error", constants.messages.errors.saveUser, err);
    })


}
// this only send client users only , for admin perspective
exports.getUser = function(req, res) {

  var params = {
    isDelete: false
  };

  if (req.query.role) {
    params['role'] = req.query.role;
  }
  console.log("req.query._id   " + req.query._id);
  if (req.query._id) {
    params['_id'] = req.query._id;
    userModel.findOne(params, function(err, user) {
      if (err)
        return response.sendResponse(res, 200, "error", constants.messages.errors.getUser, error);
      else
        return response.sendResponse(res, 200, "success", constants.messages.success.getUser, user);
    })
  } else {
    userModel.find(params)
      .populate({
        path: 'role',
        match: {
          'type': 'client'
        }
      })
      .select('username email role')
      .then(function(users) {
        users = users.filter(function(user) {
          if (user.role)
            return user; // return only users with email matching 'type: "Gmail"' query
        });
        return response.sendResponse(res, 200, "success", constants.messages.success.getUser, users);
      })
      .catch(function(error) {
        return response.sendResponse(res, 200, "error", constants.messages.errors.getUser, error);
      })
  }

}
exports.udpateUser = function(req, res) {
  var query = {
    "_id": req.body._id
  }
  delete req.body['_id'];
  var options = {
    new: true
  };
  // check for the base64 data in request to upload Failed

  waterfall([
    function(callback) {
      if(!req.body.panDetails)
        callback(null);
      else{
        // upload base 64 file
        utility.uploadImage(req.body.panDetails,function(err,imagePath){
          if(err){
            callback(err);
          }
          else{
            req.body.pan = imagePath;
            callback(null);
          }
        })
      }
      //callback(Error('Demo Error'), 'one', 'two');
    },
    function(callback) {
      if(!req.body.adharDetails)
        callback(null);
      else{
        // upload base 64 file
        utility.uploadImage(req.body.adharDetails,function(err,imagePath){
          if(err){
            callback(err);
          }
          else{
            req.body.adhar = imagePath;
            callback(null);
          }
        })
      }
    },
    function(callback) {
      if(!req.body.adharDetails)
        callback(null);
    }
  ], function(err, result) {
    if (err) {
      LOG.error(err)
    }
    else{
      userModel.findOneAndUpdate(query, req.body, options).exec()
      .then(function(data) {
        response.sendResponse(res, 200, "success", constants.messages.success.udpateRole, data);
      })
      .catch(function(err) {
        response.sendResponse(500, "error", constants.messages.error.udpateRole, err);
      })
    }
  });

}
exports.deleteUser = function(req, res) {
  var query = {
    "_id": req.params.id
  }
  delete req.body['_id'];
  userModel.findOneAndUpdate(query, {
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
