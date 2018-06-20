const MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var connectionURL = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@ds163330.mlab.com:63330/google_alerts'
//console.log(connectionURL);

function getData(collection_name, callback){
    MongoClient.connect(connectionURL, function(err, db) {
        db.collection(collection_name).find().sort({"_id":1}).toArray(function(err, data) {
            callback(err,data);
            db.close();
        });        
    });   
}

function insertData(collection_name, data, callback){
    MongoClient.connect(connectionURL, function(err, db) {
        db.collection(collection_name).insertOne(data,
            function(err, result) {
                callback(err,result);
                db.close();
          });  
    });   
}

function insertDataArray(collection_name, data, callback){
    MongoClient.connect(connectionURL, function(err, db) {
        db.collection(collection_name).insertMany(data, { ordered: false },
            function(err, result) {
                callback(err,result);
                db.close();
          });  
    });   
}

function updateData(collection_name, data, callback){
    MongoClient.connect(connectionURL, function(err, db) {
        db.collection(collection_name).update({'_id':data._id},data,{ upsert: true },
            function(err, result) {
                callback(err,result);
                db.close();
          });  
    });   
}


module.exports = {
    getData,
    insertData,
    insertDataArray,
    updateData,
}