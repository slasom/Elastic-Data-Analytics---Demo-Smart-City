'use strict';

var Setup = require('../service/SetupService');

module.exports.postSetup = function postSetup (req, res, next) {

    Setup.postSetup(req.swagger.params, res, next);

};
