'use strict';
var orchestrator=require('../orchestrator')

/**
 * Setup aggregator
 *
 * setup Setup Setup aggregator

 * returns String
 **/
module.exports.postSetup = function(req, res, next) {
    //Parameters
    console.log(req);
    res.send({
        message: 'This is the mockup controller for postSetup'
    });
};


module.exports.deleteRequest = function(req, res, next) {
    //Parameters
   
    
    orchestrator.deleteAnalytic(req.id.value)
    

    orchestrator.sendAnalytics();
    
    res.send({
        message: 'Deleted!'
    });
};




