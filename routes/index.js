var express = require('express');
var router = express.Router();
var mongo = require('../models/mongo')

/* GET home page. */
router.get('/', function(req, res, next) {
  mongo.getData('entries',function(err,data){
    data.sort(function(a,b){return new Date(b.updated) - new Date(a.updated);});
    res.render('index', { 
      title: 'Google Alerts MongoDB Test',
      data: data,
      moment: require('moment')
    });
  })
});

module.exports = router;
