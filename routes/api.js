var express = require('express');
var router = express.Router();
var homeAd = require('../tempdata/home/ad');
var cityListData = require('../tempdata/city/citylist');

router.get('/homead', function (req, res) {
    console.log('获取首页广告');
    res.json(homeAd);
});

router.get('/citylist', function (req, res) {
    console.log('获取热门城市');
    res.json(cityListData)
});

module.exports = router;
