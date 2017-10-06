var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.jobAssignmentCtrl.addJobAssignment(req, res);
});
router.get('/', function(req, res, next) {
  controllers.jobAssignmentCtrl.getJobAssignments(req, res);
});
router.put('/', function(req, res, next) {
  controllers.jobAssignmentCtrl.udpateJobAssignment(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.jobAssignmentCtrl.deleteJobAssignment(req, res);
});

module.exports = router;
