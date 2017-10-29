var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var passport = require("passport");
router.post('/',passport.authenticate('token', {session:false}),function(req, res, next) {
  controllers.referFriendCtrl.addReferredFriend(req, res);
});
router.get('/',passport.authenticate('token', {session:false}), function(req, res, next) {
  controllers.referFriendCtrl.getReferredFriend(req, res);
});
router.put('/', function(req, res, next) {
  controllers.referFriendCtrl.udpateReferredFriend(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.referFriendCtrl.deleteReferredFriend(req, res);
});

module.exports = router;
