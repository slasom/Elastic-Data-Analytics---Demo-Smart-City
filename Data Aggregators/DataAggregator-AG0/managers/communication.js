'use strict';

var vars = require('../index');
var AGG = require('../aggregator.js');
var dataManager=require('./data')
var dataCache = require('./dataCache')

var config = require('../config');

var mqttApp = vars.mqttApp;
var topicDevices = config.topicDevices;
var sender= config.topicAggregator;


var result;
var idRequest=0;
var reqMap = new Map();


//TODO: Change timeOutValue if necessary
var timeOutValue = 1000;

var optionsMqtt={
    "resource": "",
    "method": "",
    "sender":"",
    "analyticID":"",
    "idRequest": 0,
    "params": {

        }
  };

exports.sendRequest = function (req, resource, method, res){
    var id=idRequest
    idRequest++

    optionsMqtt.resource=resource;
    optionsMqtt.method="getMCHeatmaps";
    optionsMqtt.idRequest=id;

    //TODO: FUTURE WORKS
    optionsMqtt.devices=3;
    optionsMqtt.analyticID=req.analyticID;
    optionsMqtt.sender=sender
    optionsMqtt.params=req.body;

    console.log("Execute analytic - "+req.analyticID)

    dataManager.createRequest(id);
    reqMap.set(id, { res: res, analyticID: req.analyticID,method: method, body: req.body});

    //TODO: Change if necessary by your configuration
    if(config.level==config.maxLevel)
        mqttApp.publish(topicDevices, JSON.stringify(optionsMqtt));
    else
        mqttApp.publish("/result/0/"+(config.level+1), JSON.stringify(optionsMqtt));

    sendResult(id)

}


function sendResult(id){
    var obj;
    var res;
    var method;
    var params;
    var analyticID;

    setTimeout(function(){
        obj = reqMap.get(id);
        res=obj.res;
        method=obj.method;
        params= obj.body;
        analyticID=obj.analyticID

        result=dataManager.getResult(id, method, params);
        reqMap.delete(id);


        if (result.length > 0) {

            result=AGG.aggregate(result,method);

            console.log("4-INSERT DATA INTO CACHE - analyticID:"+analyticID)
            console.log(result)

            dataCache.insertData(analyticID,result)

            // res.contentType('application/json');
            // res.status(200).send(result);

         } else{
            // res.contentType('text/plain');
            // res.status(204).send("Nothing");
         }

    }, timeOutValue);
}


exports.publishMQTT = function (sender, body){
    
    mqttApp.publish(sender,body);

}


