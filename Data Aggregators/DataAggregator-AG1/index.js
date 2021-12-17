'use strict';
var config = require('./config.js');

var fs = require('fs'),
http = require('http'),
path = require('path');
var dataManager = require('./managers/data')





var express = require("express");
var app = express();

app.use(express.json({
    strict: false
}));
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var mqtt=require('mqtt');


//TODO: Change for your configuration
var serverPort = process.env.PORT ||  config.URL_PORT;

//TODO: Change for your mqtt server
const mqttApp = mqtt.connect("mqtt://"+config.MQTT.HOST+":1883");

//TODO: Topic names
// var topicDevices='HeatmapMobile';
// var topicAggregator="HeatmapAggregator/AG0";
// var level=0;


exports.mqttApp=mqttApp;
exports.app=app;


var setup = require('./service/SetupService');
var map= require('./service/MapService');
const { topicSetup } = require('./config.js');
var spec = fs.readFileSync(path.join(__dirname, '/api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
    controllers: path.join(__dirname, './controllers'),
    loglevel: 'info',
    strict: false,
    router: true,
    validator: true
};

//MQTT connection App
mqttApp.on("connect",function(){
    console.log("Connected MQTT App");
})

mqttApp.on('error', function () {
    logger.error({
        method: "connect(error)",
        arguments: arguments,
        cause: "likely MQTT issue - will automatically reconnect soon",
    }, "unexpected error");
});


//Listen MQTT App for Results
console.log("TOPICC "+config.topicAggregator)
mqttApp.subscribe(config.topicAggregator)
mqttApp.subscribe(config.topicLevel)
mqttApp.subscribe(config.topicSetup)

mqttApp.subscribe("heatmapsergiolaso")


mqttApp.on('message', function (topic, message) {
    console.log("Result received from MQTT from "+topic)

    if(topic==topicSetup){
        message= message.toString('utf8')
        var body=JSON.parse(message);
        setup.postSetup(body, "", "");

        
    }
    if(topic==config.topicLevel){
        message= message.toString('utf8')
        var body=JSON.parse(message);
        map.getResult(body,"mqtt","")

        
    }
    
    //Results arrived
    if(topic==config.topicAggregator){
        console.log("results from devices/aggregator")
        
        message= message.toString('utf8')
        var body=JSON.parse(message);

        //console.log(body)
        
        dataManager.insertData(body)
    }
    
});




oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
    http.createServer(app).listen(serverPort, function() {
        console.log("App running at http://localhost:" + serverPort);
        console.log("________________________________________________________________");
        if (options_object.docs !== false) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log("________________________________________________________________");
        }
    });
});