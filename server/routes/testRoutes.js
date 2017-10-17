var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var models = require("./../models/index");
var response = require("./../component/response");
var constants = require("./../../config/constants");
router.post('/',function(req, res, next) {

});
router.get('/', function(req, res, next) {
  models.userModel.findOne({email:"client@yopmail.com"},function(err,data) {
    if(err)
      response.sendResponse(res, 500, "error", constants.messages.errors.saveData, err);
    else {
      response.sendResponse(res, 200, "success", constants.messages.success.saveData, data);

    }
  })
});
router.put('/', function(req, res, next) {

});
router.delete('/:id', function(req, res, next) {

});

module.exports = router;
