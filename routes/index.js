var express = require('express');
var router = express.Router();
var ad = require('../tempdata/home/ad')
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json(ad)
});

module.exports = router;
