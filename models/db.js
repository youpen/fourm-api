/**
 * Created by youpen on 17/4/27.
 */
var MongoClient = require('mongodb').MongoClient;
var url = require("./dburl").dbUrl;

function _connectDB(callback) {
    MongoClient.connect(url,function (err, db) {
        if(err) {
            console.log('connect出错')
            callback(err,null)
            return;
        }
        console.log('连接了数据库成功')
        callback(err,db)
    })
}

exports.insertOne = function (collection,json,callback) {
    console.log('进入了insertOne函数')
    _connectDB(function (err, db) {
        if(err){
            console.log('connect出错')
        }
        db.collection(collection).insertOne(json,function (err,result) {
            if(err){
                callback(err,null)
            }
            callback(null,result);
            db.close();
        })
    })
};

exports.find = function (collection,json,args,callback) {
    console.log('进入了find函数')
    _connectDB(function (err,db) {
        args.pageSize = args.pageSize || 0;
        args.page = args.page || 0;

        var array = [];
        var cursor = db.collection(collection).find(json).limit(args.pageSize).skip(args.pageSize * args.page)
        cursor.forEach(function (result) {
            array.push(result)
        },function(err){
            if(err){
                console.log('foreach出错了')
            }
            callback(null,array)
        })

    })
}

exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        if(err){
            callback(err,null)
            return
        }
        db.collection(collectionName).deleteMany(json,function (err, result) {
            if(err){
                callback(err,null)
                return
            }
            callback(err,result)
        })
    })
}

exports.updateMany = function (collectionsName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionsName).updateMany(json1,json2,function (err, result) {
            callback(err,result)
        })
    })
}