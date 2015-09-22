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

router.post('/', function(req, res) {
    var product = new Product({
        owner:req.body.owner,
        phone:req.body.phone
    });

    //TODO 为什么product就是没有返回值
    product.save(function(err, product) {
        if (!err) {
            res.send(200, {
                owner: product.owner,
                phone: product.phone
            });
        } else {
            res.send(500, 'failed to save to db');
        }
    });

});

module.exports = router;