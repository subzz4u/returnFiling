var express = require('express');
var path = require('path');
var router = express.Router();
var roleRoutes = require('./roleRoutes');
var userRoutes = require('./userRoutes');
var returnFileRoutes = require('./returnFileRoutes');
var templateRoutes = require('./templateRoutes');
var categoryRoutes = require('./categoryRoutes');
// var srAuditorRoutes = require('./srAuditorRoutes');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/returnFile', returnFileRoutes);
router.use('/template', templateRoutes);
router.use('/category', categoryRoutes);
// router.use('/srAuditor',srAuditorRoutes);

module.exports = router;
