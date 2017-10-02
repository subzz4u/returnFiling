var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.templateCtrl.addTemplate(req, res);
});
router.get('/', function(req, res, next) {
  controllers.templateCtrl.getTemplate(req, res);
});
router.put('/', function(req, res, next) {
  controllers.templateCtrl.udpateTemplate(req, res);
});
router.delete('/:id', function(req, res, next) {
  controllers.templateCtrl.deleteTemplate(req, res);
});

module.exports = router;
