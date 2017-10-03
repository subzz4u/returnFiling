var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.jobCtrl.addJob(req, res);
});
router.get('/', function(req, res, next) {
  controllers.jobCtrl.getJobs(req, res);
});
router.put('/', function(req, res, next) {
  controllers.jobCtrl.udpateJob(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.jobCtrl.deleteJob(req, res);
});

module.exports = router;
