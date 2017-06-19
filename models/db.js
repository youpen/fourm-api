/**
 * Created by youpen on 17/4/27.
 */
var MongoClient = require('mongodb').MongoClient;
var url = require("./../constants/dburl").dbUrl;

function _connectDB(callback) {
    MongoClient.connect(url,function (err, db) {
        if(err) {
            console.log('connect出错')
            callback(err,null)
            return;
        }
        callback(err,db)
    })
}

exports.insertOne = function (collection,json,callback) {
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
    _connectDB(function (err,db) {
        var pageSize = args.pageSize || 0;
        var page = args.page || 0;
        var sort = args.sort;

        var array = [];
        var cursor = db.collection(collection).find(json).limit(pageSize).skip(pageSize * page).sort(sort)
        cursor.forEach(function (result) {
            array.push(result)
        },function(err){
            if(err){
                console.log('foreach出错')
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