var express = require('express');
var router = express.Router();
var homeAd = require('../tempdata/home/ad');
var cityListData = require('../tempdata/city/citylist')

var moment = require('moment')
var jwtCreator = require('../models/jwtCreator')
var jwtDecoder = require('../middlewares/jwtauth')
var md5 = require('../models/encrypto')
var db = require('../models/db');
/* GET users listing. */
router.get('/homead', function (req, res, next) {
    console.log('获取首页广告')
    res.json(homeAd);
});

router.get('/homelist', function (req, res, next) {
    console.log('获取首页列表');
    var params = req.query;
    var page = req.query.page;
    var category = req.query.category;
    var query = req.query;

    db.find('subjects', {}, {'sort': {'time': -1}, 'pageSize': 10, 'page': page}, function (err, result) {
        if (err) {
            res.send(err)
            throw err
        }
        var hasMore = true
        if (result && result.length < 10) {
            hasMore = false
        }
        res.json({data: result, hasMore: hasMore})
    })
});

router.get('/detail/info', function (req, res, next) {
    console.log('获取主题信息');
    var id = req.query.id;
    db.find('subjects', {'id': id}, {}, function (err, result) {

        if (err) {
            res.json({'returnCode': '000003', 'returnMessage': '服务器错误'})
            return
        }
        console.log('======result=====', result);
        res.json(result[0])

    });
})

router.get('/detail/comment', function (req, res, next) {
    console.log('文章评论')
    var id = req.query.id
    var page = req.query.page;
    db.find('subjects', {'id': id}, {'sort': {'time': -1}, 'pageSize': 10, 'page': page}, function (err, result) {
        if (err) {
            res.send(err)
            throw err
        }
        var commentList = result[0] && result[0]['commentlist'];
        if (commentList && commentList.length === 0) {
            res.json({});
            return
        }
        var hasMore = true;
        if (commentList && commentList.length < 10) {
            hasMore = false
        }
        res.json({data: commentList, hasMore: hasMore})
    })
})

router.get('/citylist', function (req, res, next) {
    console.log('获取热门城市');
    res.json(cityListData)
})

router.post('/postcomment', [jwtDecoder], function (req, res, next) {
    console.log('发表评论')
    var comment = req.body.comment
    var id = req.body.id

    var date = moment().format('YYYY-MM-DD HH:mm:ss')
    db.updateMany('subjects', {'id': id}, {
        $push: {
            'commentlist': {
                'comment': comment,
                'commenter': req.username,
                'date': date
            }
        }
    }, function (err, result) {
        console.log('postcomment', result.result)

    })
})

router.post('/submitcomment', function (req, res, next) {
    console.log('post评论');
    res.json({'msg': '成功'})
})

router.post('/doregister', function (req, res, next) {
    console.log('注册信息');
    var username = req.body.username;
    var password = req.body.password;

    db.find('users', {'username': username}, {}, function (err, result) {
        console.log(result)
        if (err) {
            throw err
        }
        if (result.length !== 0) {
            res.json({'returnCode': '000001', 'returnMessage': '用户名被占用'})
            return
        }

        password = md5(password)
        db.insertOne('users', {
            'username': username,
            'password': password
        }, function (err) {
            if (err) {
                res.json({'returnCode': '000003', 'returnMessage': '服务器出错'})
                return
            }
            var token = jwtCreator(username)
            res.json({'returnCode': '000000', 'username': username, 'token': token, 'returnMessage': '注册成功!'})

        })
    });
})

router.post('/dologin', function (req, res, next) {
    console.log('登录信息');
    var username = req.body.username;
    var password = req.body.password;
    db.find('users', {'username': username}, {}, function (err, result) {
        if (err) {
            throw err
        }
        if (result.length === 0) {
            res.json({'returnCode': '000001', 'returnMessage': '无此用户'})
            return
        }
        if (result[0].password !== md5(password)) {
            res.json({'returnCode': '000001', 'returnMessage': '密码错误'})
            return
        }
        var token = jwtCreator(username)
        res.json({'returnCode': '000000', 'returnMessage': '登录成功', 'token': token, 'username': username})


    });
})

router.post('/issuesuject', [jwtDecoder], function (req, res, next) {
    console.log('新主题');
    var title = req.body.title;
    var content = req.body.content;
    var time = moment().format('YYYY-MM-DD HH:mm:ss')
    var subject = {
        'id': Math.random().toString().slice(2),
        'title': title,
        'content': content,
        'author': req.username,
        'time': time,
        'commentnum': '0'
    }
    db.insertOne('subjects', subject, function (err, result) {
        if (err) {
            console.log('insertOne-subjects-err', err)
            return
        }
        res.json({'returnCode': '000000', 'returnMessage': '发表成功'})
    })

})

module.exports = router;
