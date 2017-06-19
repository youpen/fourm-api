var crypto = require("crypto");


module.exports = function(password){
    const md5 = crypto.createHash('md5');
    return md5.update(password + 'salt1921').digest('base64');
}