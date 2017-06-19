/**
 * Created by yupeng on 17/6/20.
 */
var express = require('express');
var db = require('../models/db');
var md5 = require('../models/encrypto')
var jwtCreator = require('../models/jwtCreator')
var router = express.Router();

router.post('/doregister', function (req, res) {
    console.log('注册信息');
    const username = req.body.username;
    let password = req.body.password;

    db.find('users', {'username': username}, {}, function (err, result) {
        console.log(result)
        if (err) {
            throw err
        }
        if (result.length !== 0) {
            res.json({
                'returnCode': '000001',
                'returnMessage': '用户名被占用'
            })
            return
        }

        password = md5(password);
        db.insertOne('users', {
            username,
            password
        }, function (err) {
            if (err) {
                throw err
            }
            var token = jwtCreator(username);
            res.json({
                'returnCode': '000000',
                'username': username,
                'token': token,
                'returnMessage': '注册成功!'
            })
        })

    });
})

router.post('/dologin', function (req, res) {
    console.log('登录信息');
    const errJson = {
        'returnCode': '000001',
        'returnMessage': '用户名或密码错误'
    };
    const { username } = req.body;
    let { password } = req.body;
    db.find('users', { username }, {}, function (err, result) {
        if (err) {
            throw err
        }
        if (result.length === 0) {
            res.json(errJson);
            return
        }
        if (result[0].password !== md5(password)) {
            res.json(errJson);
            return
        }
        const token = jwtCreator(username);
        res.json({
            'returnCode': '000000',
            'returnMessage': '登录成功',
            token,
            username
        })
    });
})

module.exports = router;
