'use strict';
const vars = require('../index');
const https = require('http')
var orchestrator=require('../orchestrator')

var mqttApp = vars.mqttApp;





/**
 * Get the locations frequency processed in the different connected devices.
 *
 * requestID String request ID

 * returns List
 **/
module.exports.getResult = function(req, res, next) {
    //Parameters
    console.log(req);
    res.send({
        message: 'This is the mockup controller for getResult'
    });
};


/**
 * Get the locations frequency processed in the different connected devices.
 *
 * request Request Information about the event

 * returns String
 **/
module.exports.postRequest = function(req, res, next) {
    
    //Parameters
    var valuesReq=req.undefined.value

    //console.log(valuesReq)

    var analytic= new Map();



    orchestrator.calculateAnalytic(valuesReq)
   


    orchestrator.sendAnalytics();


   // TODO: UNCOMMENT
//     console.log("2 - Publish to Setup")
    
//    // mqttApp.publish("heatmap/setup", JSON.stringify(valuesReq));
      
//     orchestrator.getAll().forEach(element => {
        
//        console.log(element.id)
//        console.log(element.analytics)
//     });

    
    res.contentType('text/plain')
    res.status(201).send("OK");

    //console.log(orchestrator.getAll())


    //TODO: CALCULATE DISTRIBUTION ETC

        //Future Work

    //TODO: POST SETUP TO ALL AGGREGATOR 
    // orchestrator.getAll().forEach(element => {
        
    //     mqttApp.publish("HeatmapAggregator/"+element.id+"/setup", JSON.stringify(valuesReq));
    // });

 

};




