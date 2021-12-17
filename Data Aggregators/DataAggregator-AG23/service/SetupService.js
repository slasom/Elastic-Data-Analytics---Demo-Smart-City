'use strict';

var sender = require('../managers/communication.js');
var params = require('../util/parameters.js');
var time = require('../util/freshness.js');
var dataCache = require('../managers/dataCache.js');
var config = require('../config');
var body;

/**
 * Setup aggregator
 *
 * setup Setup Setup aggregator
 * returns String
 **/
var paramspostSetup=["setup"];
module.exports.postSetup = function(req, res, next) {

    // body={}
    // body=params.getParams(req,paramspostSetup)
    // sender.sendRequest(body,'Setup','postSetup',res);
    console.log("3- SETUP Configuration....")

    /*Cuando llega una petición de setup:
    
    programar peticiones a los dispositivos
    
    */

    /*
        Petición 
    */
    //sender.sendRequest(body,'Map','getResult',"mqtt");

    //console.log(req)
    console.log("Reset All....")
    dataCache.stopAll();

    req.forEach(analytic => {

        //console.log(req)
        console.log("RECEIVED ANALYTIC - "+analytic.analyticID)
   

        if(dataCache.existAnalytic(analytic.analyticID)){
            console.log("There is analytics, update...")
            //clearInterval(dataCache.getTimerId(req.analyticID));


            //TODO: SEND REQUEST RESULT
            var timer_id = setInterval(function(){sender.sendRequest(analytic,'Map','getResult',"mqtt");},time.timeToMilliseconds(analytic.frequency));
            //var timer_id = setInterval(function(){console.log(req.analyticID+" | "+req.freshness);},time.timeToMilliseconds(req.freshness));
            //sender.sendRequest(body,'Map','getResult',"mqtt",req.analyticID);
            dataCache.updateTimerId(analytic.analyticID,timer_id);



        }else{
            console.log("There is no analytics, it creates...")

            //TODO: SEND REQUEST RESULT
            var timer_id = setInterval(function(){sender.sendRequest(analytic,'Map','getResult',"mqtt");},time.timeToMilliseconds(analytic.frequency));
            //var timer_id = setInterval(function(){console.log(req.analyticID+" | "+req.freshness);},time.timeToMilliseconds(req.freshness));

            dataCache.createAnalytic(analytic.analyticID, timer_id)
        }


        
    });

    


    

  
    // //publish function
    // function publish(topic,msg,options){
    //   console.log("publishing",msg);
    // if (client.connected == true){
    //   client.publish(topic,msg,options);
    // }
    //dataCache.createAnalytic(req.analyticID,timer_id)

};


