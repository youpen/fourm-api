/**
 * Created by yupeng on 17/6/20.
 */
var express = require('express');
var db = require('../models/db');

var router = express.Router();
var jwtDecoder = require('../middlewares/jwtauth')
var moment = require('moment')

router.get('/issuelist', function (req, res) {
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

router.get('/detail', function (req, res) {
    console.log('获取主题详情');
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

router.get('/comment', function (req, res) {
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

router.post('/newissue', [jwtDecoder], function (req, res) {
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
        'commentnum': 0
    }
    db.insertOne('subjects', subject, function (err, result) {
        if (err) {
            console.log('insertOne-subjects-err', err)
            return
        }
        res.json({'returnCode': '000000', 'returnMessage': '发表成功'})
    })

})

router.post('/newcomment', [jwtDecoder], function (req, res) {
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
        },
        $inc: {
            'commentnum': 1
        }
    }, function (err, result) {
        if(err) {
            console.log('发表评论err',err)
            throw err
        }
        console.log('postcomment', result.result)

    })
})


module.exports = router;
