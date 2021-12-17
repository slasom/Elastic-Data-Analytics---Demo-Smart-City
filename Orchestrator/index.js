'use strict';

var fs = require('fs'),
http = require('http'),
path = require('path');

var express = require("express");
var app = express();
app.use(express.json({
    strict: false
}));
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = 8084;

var spec = fs.readFileSync(path.join(__dirname, '/api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);


var options_object = {
    controllers: path.join(__dirname, './controllers'),
    loglevel: 'info',
    strict: false,
    router: true,
    validator: true
};



var mqtt=require('mqtt');

//TODO: Change for your mqtt server
//const mqttApp = mqtt.connect("mqtt://localhost:1883");
const mqttApp = mqtt.connect("mqtt://broker.hivemq.com:1883");
exports.mqttApp=mqttApp;

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
mqttApp.subscribe("orchestrator")

mqttApp.on('message', function (topic, message) {
    console.log("Result received from MQTT")
    message= message.toString('utf8')

    var body=JSON.parse(message);
    dataManager.insertData(body)
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