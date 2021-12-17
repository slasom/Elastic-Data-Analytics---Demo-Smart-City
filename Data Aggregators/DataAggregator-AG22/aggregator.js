'use strict';


var locationManager = require('./managers/locationmanager');

exports.aggregate =function (result, method){


    switch(method){
        case 'postRequest':
            //TODO Operation or function to process the data
            return result;
        break;
        case 'getResult':
            //TODO Operation or function to process the data

            result=locationManager.convertLocationFrequency(result)
            result=locationManager.aggregateLocations(result)

            return result;
        break;
        case 'postSetup':
            //TODO Operation or function to process the data
            return result;
        break;
    }


}