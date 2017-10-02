var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.categoryCtrl.addRole(req, res);
});
router.get('/', function(req, res, next) {
  controllers.categoryCtrl.getRole(req, res);
});
router.put('/', function(req, res, next) {
  controllers.categoryCtrl.udpateRole(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.categoryCtrl.deleteRole(req, res);
});

module.exports = router;
