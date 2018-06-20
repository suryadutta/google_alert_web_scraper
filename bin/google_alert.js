var request = require('request')
const url = require('url');
var parseString = require('xml2js').parseString;
var mongo = require('../models/mongo')


const alerts = require('google-alerts-api');
const { HOW_OFTEN, DELIVER_TO, HOW_MANY } = alerts;

let update_interval = 1; //how many minutes to run updater

console.log('google alerts scraper started');

alerts.configure({
    mail: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD
});


function returnAlertList(callback){
    alerts.sync((err) => {
        if(err) return console.log(err);
        const alertList = alerts.getAlerts();
        callback(alertList);
    });
}

function getRequestXML(url, callback) {
  request.get({url: url,headers: {}}, function(error, response, body) {
    parseString(body, function (err, result) {
      callback(err,result);
    });
  });
}

function reduceXMLobjects(alert_name, url_entry, callback){
  var parseID = (ID) => {return ID.split("feed:")[1]}
  var parseURL = (url_entry) => {
    var parsed_url = url.parse(url_entry.split("&url=")[1]);      
    return [parsed_url.protocol, '//', parsed_url.host, parsed_url.pathname].join('').split('&')[0]
  }

  getRequestXML(url_entry, function(err,RSSfeed){
    var newEntries = RSSfeed.feed.entry.map(entry => ({
      '_id': parseID(entry.id[0]),
      'alert_name': alert_name,
      'title': entry.title[0]._,
      'link': parseURL(entry.link[0].$.href),
      'published': entry.published[0],
      'updated': entry.updated[0]
    }));
    callback(err,newEntries);
  });
}

function cronUpdater(){
    returnAlertList(function(alertList){
        var alert_names = alertList.map(alert => alert.name)
        var alert_urls = alertList.map(alert => alert.rss)
        for (i = 0; i < alert_urls.length; i++) { 
            reduceXMLobjects(alert_names[i],alert_urls[i], function(err,alert_entries){
                for (i = 0; i < alert_entries.length; i++) { 
                    mongo.updateData('entries',alert_entries[i],function(err,result){
                        if (err) console.log(err)
                        console.log(result);
                    });
                }
            });
        } 
    });
}

cronUpdater();
setInterval(function() {cronUpdater();}, update_interval * 60 * 1000);

module.exports = {
    alerts,
    returnAlertList,
    cronUpdater,
}