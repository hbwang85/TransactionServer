/**
 * Created by hbwang on 9/3/15.
 */
var express = require('express');
var router = express.Router();
var qiniu = require('qiniu');

router.post('/uptoken', function(req, res, next) {
    console.log(req.body);

    res.send(200, {
        //endUser: req.body.endUser,
        upToken: uptoken('resources')
    });
});

module.exports = router;


function uptoken(bucketname) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);
    //putPolicy.callbackUrl = callbackUrl;
    //putPolicy.callbackBody = callbackBody;
    //putPolicy.returnUrl = returnUrl;
    //putPolicy.returnBody = returnBody;
    //putPolicy.asyncOps = asyncOps;
    //putPolicy.expires = expires;

    return putPolicy.token();
}

function PutExtra(params, mimeType, crc32, checkCrc) {
    this.paras = params || {};
    this.mimeType = mimeType || null;
    this.crc32 = crc32 || null;
    this.checkCrc = checkCrc || 0;
}

