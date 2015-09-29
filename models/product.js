/**
 * Created by hbwang on 9/20/15.
 */


var domain = '7xlenv.com1.z0.glb.clouddn.com';
var qiniu = require('qiniu');
var mongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/transaction';
var kPhotoKey = 'photokey';
var kPhotoUrl = 'photourl';


function Product(product) {
    this.owner = product.owner;
    this.phone = product.phone;
    this.photokey =  product.photokey;
}

module.exports = Product;

Product.prototype.save = function save(callback) {
    var product = {
        owner: this.owner,
        phone: this.phone,
        photokey: this.photokey
    };

    mongoClient.connect(dbUrl, function(err, db){
        if (!err) {
            console.log('Connected correctly to server');
            insertDocuments(product, db, function(err, inserted){
                db.close(true, callback(err, inserted));
            })

        } else {
            db.close(true, callback(err));

        }
    });

};

var insertDocuments = function(doc, db, callback) {
    db.collection('products').insertOne(doc, function (err, result) {
        callback(err, result);
    })
};

Product.get = function get(callback) {
    mongoClient.connect(dbUrl, function(err, db) {
        if (!err) {
            db.collection('products').find({}).toArray(function(err, docs){
                var array = docs;
                array.forEach(function(doc){
                    doc[kPhotoUrl] = downloadUrl(domain, doc[kPhotoKey]);
                });
                array.reverse();
                db.close(true, callback(err, array));
            });
        } else {
            db.close(true, callback(err));
        }
    });

};


//Product.get = function get(ownerName, callback) {
//    mongodb.open(function(err, db){
//        if (err) {
//            return callback(err);
//        }
//
//        db.collection('products', function(err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//
//            if (ownerName) {
//                collection.find({owner:ownerName}).toArray(function(err, doc) {
//                    mongodb.close();
//                    if (doc) {
//                        var product = new Product(doc);
//                        callback(err, product);
//                    }
//                });
//            } else {
//                collection.find({}).toArray(function(err, docs){
//                    mongodb.close();
//                    if (docs) {
//                        callback(null, docs);
//                    }
//                })
//            }
//
//        });
//    });
//};


function downloadUrl(domain, key) {
    var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
    var policy = new qiniu.rs.GetPolicy();
    return policy.makeRequest(baseUrl);
}
