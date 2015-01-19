/*
 * load express & router
 */
var express = require('express');
var router = express.Router();

/*
 * load flight api
 */
var airlineAPI = require('../modules/airlineAPI');

/* GET airports resource. */
router.get('/', function(req, res, next) {
	airlineClient = airlineAPI.getApiClient(req.ENVIRONMENT);
  	airlineClient.getAirlines(function(airlines){
  		res.writeHead(200, { 'Content-Type': 'application/json' });	
	
		res.end(JSON.stringify(airlines));
  	});
});

module.exports = router;
