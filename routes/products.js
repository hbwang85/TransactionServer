/**
 * Created by hbwang on 9/21/15.
 */
var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.get('/', function(req, res){
    Product.get(function(err, docs){
        if (!err) {
            res.status(200).send(docs);
        } else {
            res.status(500).send('failed to retrieve products');
        }

    })
});

router.post('/', function(req, res) {
    var product = new Product({
        owner:req.body.owner,
        phone:req.body.phone,
        photokey:req.body.photokey
    });

    product.save(function(err, product) {
        if (!err) {
            res.status(200).send({

                owner: product.ops[0].owner,
                phone: product.ops[0].phone,
                photourl: product.ops[0].photourl
            });
        } else {
            res.send(500, 'failed to save to db');
        }
    });

});

module.exports = router;