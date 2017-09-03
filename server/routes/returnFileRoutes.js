var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var passport = require("passport");
router.post('/',function(req, res, next) {
  controllers.returnFileCtrl.addReturnFile(req, res);
});
router.get('/', passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.returnFileCtrl.getReturnFile(req, res);
});
router.get('/itr', passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.returnFileCtrl.getItr(req, res);
});
router.get('/count', function(req, res, next) {
  controllers.returnFileCtrl.getReturnFileCounts(req, res);
});
router.put('/', function(req, res, next) {
  controllers.returnFileCtrl.udpateReturnFile(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.returnFileCtrl.deleteReturnFile(req, res);
});

module.exports = router;
