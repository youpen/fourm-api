var express = require('express');
var router = express.Router();
var homeAd = require('../tempdata/home/ad');
var list = require('../tempdata/home/list')
var comments = require('../tempdata/detail/comment')
var merchantInfo = require('../tempdata/detail/info')
var cityListData = require('../tempdata/city/citylist')
var orderlist = require('../tempdata/orderList/orderList')

var moment = require('moment')
var jwtCreator = require('../models/jwtCreator')
var jwtDecoder = require('../middlewares/jwtauth')
var md5 = require('../models/md5')
var crypto =require('crypto')
var db = require('../models/db');
/* GET users listing. */
router.get('/homead', function(req, res, next) {
    console.log('获取首页广告')
    res.json(homeAd);
});

router.get('/homelist', function(req, res, next) {
  console.log('获取列表');
  var params = req.query;
    var page = req.query.page;
    var category = req.query.category;
    var query = req.query;

  console.log('当前城市：' + params.city)
  console.log('当前页数：' + params.page)
  console.log('当前种类：' + params.category)
  console.log('当前关键词：' + params.query)
    db.find('subjects',{},{},function (err, result) {
        if(err){
            res.send(err)
            throw err
        }
        res.json(result)
        console.log('err',err)
        console.log('result',result)
    })
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

router.post('/doregister', function (req, res, next) {

    console.log('注册信息');
    var username = req.body.username;
    var password = req.body.password;
    console.log('用户名'+username)
    console.log('密码'+ password);

    db.find('users',{'username':username},{},function (err, result) {
        console.log(result)
        if(err) {
            res.json({'returnCode':'000003','returnMessage':'服务器错误'})
            return
        }
        if(result.length !== 0) {
            res.json({'returnCode':'000001','returnMessage':'用户名被占用'})
            return
        }

        password = md5(password)
        db.insertOne('users',{
            'username':username,
            'password':password
        }, function (err) {
            if(err){
                res.json({'returnCode':'000003','returnMessage':'服务器出错'})
                return
            }
            var token = jwtCreator(username)
            res.json({'returnCode':'000000','username':username,'token':token,'returnMessage':'注册成功!'})

        })
    });
})

router.post('/dologin', function (req, res, next) {
    console.log('登录信息');
    var username = req.body.username;
    var password = req.body.password;
    console.log('用户名'+username)
    console.log('密码'+ password);

    db.find('users',{'username':username},{},function (err, result) {
        console.log(result)
        if(err) {
            res.json({'returnCode':'000003','returnMessage':'服务器错误'})
            return
        }
        if(result.length === 0) {
            res.json({'returnCode':'000001','returnMessage':'无此用户'})
            return
        }
        if(result[0].password !== md5(password)) {
            res.json({'returnCode':'000001','returnMessage':'密码错误'})
            return
        }
        var token = jwtCreator(username)
        res.json({'returnCode':'000000','returnMessage':'登录成功','token':token,'username':username})


    });
})

router.post('/issuesuject',[jwtDecoder], function (req, res, next) {
    console.log('新主题');
    console.log('token',req.body.token)
    var title = req.body.title;
    var content = req.body.content;
    console.log('标题'+title)
    console.log('内容'+ content);
    console.log('username'+ req.username);
    var time = moment().format('YYYY-MM-DD HH:mm:ss')
    var subject = {
        'id':Math.random().toString().slice(2),
        'title':title,
        'content':content,
        'author':req.username,
        'time':time,
        'commentnum': '0'
    }
    db.insertOne('subjects',subject, function (err, result) {
        if (err) {
            console.log(err)
            return
        }
        res.json({'returnCode':'000000','returnMessage':'发表成功'})
    })

})




module.exports = router;
