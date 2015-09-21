/**
 * Created by hbwang on 9/21/15.
 */
var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.get('/', function(req, res){
    Product.get(null, function(err, docs){
        if (!err) {
            res.send(200, docs);
        } else {
            res.send(500, 'failed to retrieve products');
        }

    })
});

module.exports = router;