'use strict';
const https = require('http')
var fs = require('fs')

var sender = require('../managers/communication.js');
var params = require('../util/parameters.js');
var dataCache=require('../managers/dataCache')
var body;


var idRequest=0;

/**
 * Get the locations frequency processed in the different connected devices.
 *
 * requestID String request ID
 * returns List
 **/
var paramsgetResult=["analyticID"];
module.exports.getResult = function(req, res, next) {

    // body={}
    // body=params.getParams(req,paramsgetResult)

    

    if(res=="mqtt"){

      var result=dataCache.returnResults(req.analyticID)
      
      var json={
        "idRequest": req.idRequest,
        "body": result
      };
      sender.publishMQTT(req.sender, JSON.stringify(json))

    }else{

      console.log("Result request for analyticID "+req.id.value)

      var result=dataCache.returnResults(req.id.value)

      res.status(200).send(result);
  }

    //sender.sendRequest(body,'Map','getResult',res);

};


/**
 * Get the locations frequency processed in the different connected devices.
 *
 * request Request Information about the event
 * returns String
 **/
module.exports.postRequest = function(req, res, next) {

    //console.log(req);
    requestToOrchestrator(res,req.undefined.value)

};



function requestToOrchestrator (res, data){

    var id=idRequest
    idRequest++
    
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
        path: '/request',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          }
    }

 // console.log(options)


    console.log("1 - REQUEST TO ORCHESTRATOR")

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


