/**
 * Created by hbwang on 9/21/15.
 */
var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.post('/', function(req, res) {
    var newProduct = new Product({
        owner:req.body.name,
        phone:req.body.phone
    });

    newProduct.save(function(err, product) {
        if (!err) {
            res.send(200, {
                owner: product.owner,
                phone: product.phone,
            });
        } else {
            res.send(500, 'failed to save to db');
        }
    });

});

module.exports = router;