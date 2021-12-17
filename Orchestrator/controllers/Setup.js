




'use strict';

var Setup = require('../service/SetupService');

module.exports.postSetup = function postSetup (req, res, next) {

    Setup.postSetup(req.swagger.params, res, next);

};


module.exports.deleteRequest = function deleteRequest (req, res, next) {

    Setup.deleteRequest(req.swagger.params, res, next);

};
