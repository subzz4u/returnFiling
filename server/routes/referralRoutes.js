var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var passport = require("passport");
router.get('/',passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.referralCtrl.getReferral(req, res);
});
router.get('/count',passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.referralCtrl.getReferralCount(req, res);
});
router.get('/overview',passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.referralCtrl.getOverView(req, res);
});
// router.get('/', function(req, res, next) {
//   controllers.referralCtrl.getRole(req, res);
// });
// router.put('/', function(req, res, next) {
//   controllers.referralCtrl.udpateRole(req, res);
// });
// router.delete('/:id', function(req, res, next) {
//   controllers.referralCtrl.deleteRole(req, res);
// });

module.exports = router;
