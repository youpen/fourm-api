/**
 * Created by yupeng on 17/6/15.
 */
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function (username) {
    var expires = moment().add('days', 7).valueOf();
    return jwt.encode({
        iss: username,
        exp: expires
    }, 'BTC_SECRET_STRING');
}