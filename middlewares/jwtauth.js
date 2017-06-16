/**
 * Created by yupeng on 17/6/15.
 */
var jwt = require('jwt-simple');
var key = require('../constants/jwtKey')
module.exports = function (req, res, next) {
    var token = (req.body && req.body.token) || (req.query && req.query.access_token) || req.header['x-access-token']
    if (token) {

        try {
            var decoded = jwt.decode(token,key);
            req.username = decoded.iss;
            next()
        } catch (err) {
            throw err
            return next()
        }
    } else {
        next()
    }
}