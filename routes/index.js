var express = require('express');
var router = express.Router();
var mongo = require('../models/mongo')

/* GET home page. */
router.get('/', function(req, res, next) {
  mongo.getData('entries',function(err,data){
    res.render('index', { 
      title: 'Google Alerts MongoDB Test',
      data: data,
    });
  })
});

module.exports = router;
