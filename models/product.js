/**
 * Created by hbwang on 9/20/15.
 */

var mongodb = require('./db');

function Product(product) {
    this.owner = product.owner;
    this.phone = product.phone
}

module.exports = Product;

Product.prototype.save = function save(callback) {
    var product = {
        owner: this.owner,
        phone: this.phone
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('products', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.ensureIndex('owner', {unique: true});
            collection.insert(product, {safe:true}, function(err, product){
                mongodb.close();
                callback(err, product);
            });
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
                collection.find({owner:ownerName}, {'_id':false}).toArray(function(err, doc) {
                    mongodb.close();
                    if (doc) {
                        var product = new Product(doc);
                        callback(err, product);
                    }
                });
            } else {
                collection.find({}, {'_id':false}).toArray(function(err, docs){
                    mongodb.close();
                    if (docs) {
                        callback(null, docs);
                    }
                })
            }

        });
    });
};

