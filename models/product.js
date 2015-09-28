/**
 * Created by hbwang on 9/20/15.
 */

var mongodb = require('./db');
var domain = '7xlenv.com1.z0.glb.clouddn.com';
var qiniu = require('qiniu');

function Product(product) {
    this.owner = product.owner;
    this.phone = product.phone;
    this.photourl = downloadUrl(domain, product.photokey);
}

module.exports = Product;

Product.prototype.save = function save(callback) {
    var product = {
        owner: this.owner,
        phone: this.phone,
        photourl: this.photourl
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        //db.collection('products', function(err, collection) {
        //    if (err) {
        //        mongodb.close();
        //        return callback(err);
        //    }
        //
        //    //collection.ensureIndex('owner', {unique: true});
        //    collection.insert(product, function(err, product){
        //        mongodb.close();
        //        callback(err, product);
        //    });
        //});

        db.collection('products').insertOne(product, function(err, inserted){
            if (err) {
                db.close(true, callback(err));
            } else {
                db.close(true, callback(err, inserted));
            }

        });


    });
};

Product.get = function get(ownerName, callback) {
    mongodb.open(function(err, db){
        if (err) {
            return callback(err);
        }

        db.collection('products', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            if (ownerName) {
                collection.find({owner:ownerName}).toArray(function(err, doc) {
                    mongodb.close();
                    if (doc) {
                        var product = new Product(doc);
                        callback(err, product);
                    }
                });
            } else {
                collection.find({}).toArray(function(err, docs){
                    mongodb.close();
                    if (docs) {
                        callback(null, docs);
                    }
                })
            }

        });
    });
};


function downloadUrl(domain, key) {
    var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
    var policy = new qiniu.rs.GetPolicy();
    return policy.makeRequest(baseUrl);
}
