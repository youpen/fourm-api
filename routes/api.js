var express = require('express');
var router = express.Router();
var homeAd = require('../tempdata/home/ad');
var list = require('../tempdata/home/list')
var comments = require('../tempdata/detail/comment')
var merchantInfo = require('../tempdata/detail/info')
var cityListData = require('../tempdata/city/citylist')
var orderlist = require('../tempdata/orderList/orderList')

/* GET users listing. */
router.get('/homead', function(req, res, next) {
  console.log('获取首页广告')
  res.json(homeAd);
});

router.get('/homelist', function(req, res, next) {
  console.log('获取列表');
  var params = req.query
  console.log('当前城市：' + params.city)
  console.log('当前页数：' + params.page)
  console.log('当前种类：' + params.category)
  console.log('当前关键词：' + params.query)
  res.json(list);
});

router.get('/detail/info', function (req, res, next) {
  console.log('获取商户信息');
  var params = req.query
  console.log('当前商户id：' + params.page)
  res.json(merchantInfo)
})

router.get('/detail/comment', function (req, res, next) {
  console.log('详情页 - 用户点评')
  var params = req.query
  console.log('当前页：' + params.city)
  console.log('当前商户id：' + params.page)
  res.json(comments)
})

router.get('/citylist', function (req, res, next) {
    console.log('获取热门城市');
    res.json(cityListData)
})

router.get('/orderlist', function (req, res, next) {
    console.log('获取个人订单');
    res.json(orderlist)
})

router.post('/submitcomment', function (req, res, next) {
    console.log('post评论');
    var body = req.body;
    console.log('评论商户id'+body.id)
    console.log('评论内容'+ body.comment);
    res.json({'msg':'成功'})
})


module.exports = router;
