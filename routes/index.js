var express = require('express');
var router = express.Router();
var ad = require('../tempdata/home/ad')
/* GET home page. */
router.get('/', function(req, res, next) {
  //todo index.html & javascript on cloud
  res.json({})
});

module.exports = router;
