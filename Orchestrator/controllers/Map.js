




'use strict';

var Map = require('../service/MapService');

module.exports.getResult = function getResult (req, res, next) {

    Map.getResult(req.swagger.params, res, next);

};

module.exports.postRequest = function postRequest (req, res, next) {

    Map.postRequest(req.swagger.params, res, next);

};
