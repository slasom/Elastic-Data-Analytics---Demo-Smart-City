'use strict';
const https = require('http')
var sender = require('../managers/communication.js');
var params = require('../util/parameters.js');
var time = require('../util/freshness.js');
var dataCache = require('../managers/dataCache.js');
var config = require('../config');
var body;



/**
 * Delete request
 *
 * 
 **/


module.exports.deleteRequest = function(req, res, next) {

    dataCache.deleteContent(req.id.value)
    requestToOrchestrator(res,req.id.value)

}

function requestToOrchestrator (res, data){

    
      // var data={
      //   "beginDate": "2019-06-09T09:00:28Z",
      //   "endDate": "2019-06-21T22:32:28Z",
      //   "latitude": 37.378833,
      //   "longitude": -5.976987,
      //   "radius": 3000,
      //   "analyticID": id,
      //   "freshness": "5s",
      //   "accuracy": "LOW"
      // };

    var result;
    
    const options = {
        hostname: 'localhost',
        port: 8084,
        path: '/delete/'+data,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          }
    }

 // console.log(options)


    console.log("1 - DELETE")

  const req = https.request(options, res2 => {
        console.log(`statusCode: ${res2.statusCode}`)

        res2.on('data', d => {

            result=process.stdout.write(d)

             res.contentType('text/plain');
             //res.status(201).send(JSON.parse(d));
             res.status(201).send(d);
             //RESPONSE OK, WAIT TO /SETUP
           
        })
    });
    req.write(JSON.stringify(data))
    req.end()

}

/**
 * Setup aggregator
 *
 * setup Setup Setup aggregator
 * returns String
 **/

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


